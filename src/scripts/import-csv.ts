import { Command } from "commander";
import path from "node:path";
import { readCsv } from "../lib/csv.js";
import { getRequiredEnvVar } from "../lib/env.js";
import { mapRowToContactPayload } from "../lib/contact-row.js";
import { createResendClient } from "../lib/resend-client.js";
import { sleep } from "../lib/sleep.js";
import { isValidEmail } from "../lib/validators.js";

interface ImportOptions {
  file: string;
  segmentId?: string;
  delayMs: string;
  dryRun?: boolean;
}

const program = new Command();

program
  .name("import-csv")
  .description(
    "Import CSV rows as Resend contacts and assign them to a segment.",
  )
  .requiredOption("--file <path>", "Path to CSV file (e.g. users.csv)")
  .option(
    "--segment-id <id>",
    "Resend segment ID override (defaults to SEGMENT_ID env var)",
  )
  .option(
    "--delay-ms <ms>",
    "Delay between contact API calls to avoid rate limits",
    "800",
  )
  .option("--dry-run", "Validate and print rows without calling Resend API", false);

program.parse(process.argv);

const options = program.opts<ImportOptions>();

async function main(): Promise<void> {
  const filePath = options.file.trim();
  const segmentId = options.segmentId?.trim() ?? getRequiredEnvVar("SEGMENT_ID");
  const apiKey = getRequiredEnvVar("RESEND_API_KEY");
  const resend = createResendClient(apiKey);
  const delayMs = Number.parseInt(options.delayMs, 10);

  if (Number.isNaN(delayMs) || delayMs < 0) {
    throw new Error("--delay-ms must be a positive number.");
  }

  const absoluteCsvPath = path.resolve(process.cwd(), filePath);
  const rows = await readCsv(absoluteCsvPath);

  if (rows.length === 0) {
    console.log(`No rows found in CSV: ${absoluteCsvPath}`);
    return;
  }

  let importedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    const contactPayload = mapRowToContactPayload(row, segmentId);

    if (!isValidEmail(contactPayload.email)) {
      skippedCount += 1;
      console.log(
        `[SKIP] Row ${rowNumber}: invalid/missing email "${contactPayload.email}".`,
      );
      continue;
    }

    if (options.dryRun) {
      console.log(
        `[DRY RUN] Row ${rowNumber}: would import ${contactPayload.email} into segment ${segmentId}.`,
      );
      importedCount += 1;
      continue;
    }

    try {
      const firstAttempt = await resend.contacts.create(contactPayload);

      if (!firstAttempt.error) {
        importedCount += 1;
        console.log(
          `[OK] Row ${rowNumber}: ${contactPayload.email} (contact id: ${firstAttempt.data?.id ?? "n/a"})`,
        );
      } else if (
        contactPayload.properties &&
        firstAttempt.error.message.toLowerCase().includes("properties do not exist")
      ) {
        // Fallback import when contact properties have not been pre-created in Resend.
        const { properties: _unused, ...payloadWithoutProperties } = contactPayload;
        const secondAttempt = await resend.contacts.create(payloadWithoutProperties);

        if (secondAttempt.error) {
          failedCount += 1;
          console.error(
            `[FAIL] Row ${rowNumber}: ${contactPayload.email} -> ${secondAttempt.error.message}`,
          );
        } else {
          importedCount += 1;
          console.log(
            `[OK] Row ${rowNumber}: ${contactPayload.email} imported without custom properties (contact id: ${secondAttempt.data?.id ?? "n/a"})`,
          );
        }
      } else {
        failedCount += 1;
        console.error(
          `[FAIL] Row ${rowNumber}: ${contactPayload.email} -> ${firstAttempt.error.message}`,
        );
      }
    } catch (error) {
      failedCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[ERROR] Row ${rowNumber}: ${contactPayload.email} -> ${message}`,
      );
    }

    if (index < rows.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  console.log("");
  console.log("Import summary");
  console.log(`- CSV file: ${absoluteCsvPath}`);
  console.log(`- Segment: ${segmentId}`);
  console.log(`- Total rows: ${rows.length}`);
  console.log(`- Imported: ${importedCount}`);
  console.log(`- Skipped: ${skippedCount}`);
  console.log(`- Failed: ${failedCount}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Import failed: ${message}`);
  process.exitCode = 1;
});
