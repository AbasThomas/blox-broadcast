import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  BUILT_IN_TEMPLATE_IDS,
  BUILT_IN_TEMPLATES,
} from "../emails/index.js";
import type { BroadcastTemplate } from "../emails/types.js";
import { htmlToText } from "./text.js";

type DynamicTemplateModule = {
  default?: unknown;
  template?: unknown;
  broadcastTemplate?: unknown;
};

function isBroadcastTemplate(value: unknown): value is BroadcastTemplate {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.html === "string" &&
    typeof candidate.text === "string"
  );
}

function normalizeTemplateId(reference: string): string {
  return reference
    .replace(/\\/g, "/")
    .replace(/^src\/emails\//, "")
    .replace(/\.(ts|js|mjs|cjs|html)$/i, "");
}

export async function loadTemplate(
  templateRef: string,
): Promise<BroadcastTemplate> {
  const normalizedId = normalizeTemplateId(templateRef);
  const builtInTemplate = BUILT_IN_TEMPLATES[normalizedId];
  if (builtInTemplate) {
    return builtInTemplate;
  }

  const resolvedPath = path.resolve(process.cwd(), templateRef);
  const extension = path.extname(resolvedPath).toLowerCase();

  if (extension === ".html") {
    const html = await fs.readFile(resolvedPath, "utf8");
    return {
      id: path.basename(resolvedPath, ".html"),
      html,
      text: htmlToText(html),
    };
  }

  if (![".ts", ".js", ".mjs", ".cjs"].includes(extension)) {
    throw new Error(
      `Unsupported template type for "${templateRef}". Use a built-in template ID (${BUILT_IN_TEMPLATE_IDS.join(
        ", ",
      )}), .html, .ts, or .js file.`,
    );
  }

  const moduleUrl = pathToFileURL(resolvedPath).href;
  const moduleData = (await import(moduleUrl)) as DynamicTemplateModule;
  const templateCandidate =
    moduleData.default ?? moduleData.template ?? moduleData.broadcastTemplate;

  if (!isBroadcastTemplate(templateCandidate)) {
    throw new Error(
      `Template module "${templateRef}" must export a template object as default export (or named export "template") with: { id, html, text }.`,
    );
  }

  return templateCandidate;
}

