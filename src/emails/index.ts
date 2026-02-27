import productAnnouncementTemplate from "./product-announcement.js";
import waitlistUpdateTemplate from "./waitlist-update.js";
import type { BroadcastTemplate } from "./types.js";

export const BUILT_IN_TEMPLATES: Record<string, BroadcastTemplate> = {
  [waitlistUpdateTemplate.id]: waitlistUpdateTemplate,
  [productAnnouncementTemplate.id]: productAnnouncementTemplate,
};

export const BUILT_IN_TEMPLATE_IDS = Object.keys(BUILT_IN_TEMPLATES);

