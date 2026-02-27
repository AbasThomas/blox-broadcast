import dotenv from "dotenv";

dotenv.config({ quiet: true });

export function getRequiredEnvVar(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getOptionalEnvVar(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function assertFileArg(filePath: string | undefined): string {
  const value = filePath?.trim();
  if (!value) {
    throw new Error("Missing required --file argument.");
  }
  return value;
}
