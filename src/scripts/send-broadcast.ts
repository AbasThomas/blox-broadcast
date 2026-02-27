import { Command } from "commander";
import type { CreateBroadcastOptions, CreateEmailOptions } from "resend";
import { getOptionalEnvVar, getRequiredEnvVar } from "../lib/env.js";
import { createResendClient } from "../lib/resend-client.js";
import { normalizeSchedule } from "../lib/schedule.js";
import { loadTemplate } from "../lib/template-loader.js";

interface SendOptions {
  template: string;
  subject?: string;
  from?: string;
  replyTo?: string;
  segmentId?: string;
  schedule?: string;
  name?: string;
  test?: string | boolean;
  previewText?: string;
  dryRun?: boolean;
}

const program = new Command();

program
  .name("send-broadcast")
  .description("Send a Resend broadcast to a segment, or a one-off test email.")
  .requiredOption(
    "--template <template>",
    "Built-in template ID (e.g. waitlist-update) or file path (.html/.ts/.js)",
  )
  .option("--subject <subject>", "Broadcast subject override")
  .option("--from <from>", "From sender (defaults to RESEND_FROM_EMAIL)")
  .option("--reply-to <replyTo>", "Reply-to email (or comma-separated list)")
  .option(
    "--segment-id <id>",
    "Resend segment ID override (defaults to SEGMENT_ID env var)",
  )
  .option(
    "--schedule <schedule>",
    'Optional schedule time. Accepts ISO format or natural language like "tomorrow at 9am WAT".',
  )
  .option("--name <name>", "Optional broadcast name")
  .option(
    "--test [email]",
    "Test mode. Sends a single email to provided address (or TEST_EMAIL env var) instead of broadcast.",
  )
  .option("--preview-text <text>", "Preview text override")
  .option("--dry-run", "Print payload without calling Resend API", false);

program.parse(process.argv);
const options = program.opts<SendOptions>();

function parseReplyTo(value: string | undefined): string | string[] | undefined {
  if (!value?.trim()) {
    return undefined;
  }
  const addresses = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (addresses.length === 0) {
    return undefined;
  }
  return addresses.length === 1 ? addresses[0] : addresses;
}

async function main(): Promise<void> {
  const apiKey = getRequiredEnvVar("RESEND_API_KEY");
  const resend = createResendClient(apiKey);

  const template = await loadTemplate(options.template);
  const from = options.from?.trim() ?? getRequiredEnvVar("RESEND_FROM_EMAIL");
  const replyTo = parseReplyTo(options.replyTo);
  const subject = options.subject?.trim() || template.subject;

  if (!subject) {
    throw new Error(
      "No subject provided. Pass --subject or set a default subject in the template.",
    );
  }

  let scheduledAt: string | undefined;
  if (options.schedule?.trim()) {
    const normalized = normalizeSchedule(options.schedule);
    scheduledAt = normalized.scheduledAt;
    if (!normalized.parsed) {
      console.log(
        `[WARN] Could not parse --schedule to a Date. Passing through raw value: "${scheduledAt}"`,
      );
    }
  }

  const previewText = options.previewText?.trim() || template.previewText;
  const isTestMode = Boolean(options.test);

  if (isTestMode) {
    const testEmailOption =
      typeof options.test === "string" ? options.test.trim() : "";
    const testEmail = testEmailOption || getOptionalEnvVar("TEST_EMAIL");
    if (!testEmail) {
      throw new Error(
        "Test mode requires an email: pass --test you@example.com or set TEST_EMAIL.",
      );
    }

    const testPayload: CreateEmailOptions = {
      from,
      to: testEmail,
      subject,
      html: template.html,
      text: template.text,
      replyTo,
      scheduledAt,
    };

    if (options.dryRun) {
      console.log("[DRY RUN] Test email payload:");
      console.log(JSON.stringify(testPayload, null, 2));
      return;
    }

    const { data, error } = await resend.emails.send(testPayload);
    if (error) {
      throw new Error(`Resend test email error: ${error.message}`);
    }

    console.log(`Test email queued successfully.`);
    console.log(`- Email ID: ${data?.id ?? "n/a"}`);
    console.log(`- To: ${testEmail}`);
    console.log(`- Scheduled: ${scheduledAt ?? "immediate"}`);
    return;
  }

  const segmentId = options.segmentId?.trim() ?? getRequiredEnvVar("SEGMENT_ID");
  const name = options.name?.trim() || `${template.id}-${Date.now()}`;

  const broadcastPayload: CreateBroadcastOptions = {
    name,
    from,
    subject,
    html: template.html,
    text: template.text,
    previewText,
    replyTo,
    segmentId,
    send: true,
    scheduledAt,
  };

  if (options.dryRun) {
    console.log("[DRY RUN] Broadcast payload:");
    console.log(JSON.stringify(broadcastPayload, null, 2));
    return;
  }

  const { data, error } = await resend.broadcasts.create(broadcastPayload);
  if (error) {
    throw new Error(`Resend broadcast error: ${error.message}`);
  }

  console.log("Broadcast queued successfully.");
  console.log(`- Broadcast ID: ${data?.id ?? "n/a"}`);
  console.log(`- Segment ID: ${segmentId}`);
  console.log(`- Scheduled: ${scheduledAt ?? "immediate"}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Broadcast failed: ${message}`);
  process.exitCode = 1;
});

