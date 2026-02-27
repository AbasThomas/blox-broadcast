import type { CreateContactOptions } from "resend";
import type { CsvRow } from "./csv.js";
import { parseNumber } from "./validators.js";

const RESERVED_KEYS = new Set([
  "email",
  "email_address",
  "first_name",
  "firstname",
  "last_name",
  "lastname",
]);

function getFirstNonEmpty(row: CsvRow, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function extractEmail(row: CsvRow): string | undefined {
  return getFirstNonEmpty(row, ["email", "email_address"]);
}

export function mapRowToContactPayload(
  row: CsvRow,
  segmentId: string,
): Omit<CreateContactOptions, "email"> & { email: string } {
  const email = extractEmail(row) ?? "";
  const firstName = getFirstNonEmpty(row, ["first_name", "firstname"]);
  const lastName = getFirstNonEmpty(row, ["last_name", "lastname"]);

  const properties: Record<string, string | number | null> = {};

  for (const [key, value] of Object.entries(row)) {
    if (RESERVED_KEYS.has(key)) {
      continue;
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      properties[key] = null;
      continue;
    }

    properties[key] = parseNumber(trimmedValue) ?? trimmedValue;
  }

  const payload: Omit<CreateContactOptions, "email"> & { email: string } = {
    email,
    firstName,
    lastName,
    segments: [{ id: segmentId }],
    properties: Object.keys(properties).length > 0 ? properties : undefined,
  };

  return payload;
}

