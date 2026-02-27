import fs from "node:fs";
import path from "node:path";
import csv from "csv-parser";

export type CsvRow = Record<string, string>;

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export async function readCsv(filePath: string): Promise<CsvRow[]> {
  const absolutePath = path.resolve(process.cwd(), filePath);

  return await new Promise<CsvRow[]>((resolve, reject) => {
    const rows: CsvRow[] = [];

    fs.createReadStream(absolutePath)
      .on("error", reject)
      .pipe(
        csv({
          mapHeaders: ({ header }) => normalizeHeader(header),
        }),
      )
      .on("data", (row: Record<string, unknown>) => {
        const normalizedRow: CsvRow = {};
        for (const [key, rawValue] of Object.entries(row)) {
          normalizedRow[normalizeHeader(key)] = String(rawValue ?? "").trim();
        }
        if (Object.keys(normalizedRow).length > 0) {
          rows.push(normalizedRow);
        }
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

