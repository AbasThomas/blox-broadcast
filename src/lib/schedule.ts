import * as chrono from "chrono-node";

export function normalizeSchedule(scheduleInput: string): {
  scheduledAt: string;
  parsed: boolean;
} {
  const trimmed = scheduleInput.trim();
  if (!trimmed) {
    throw new Error("Schedule value cannot be empty.");
  }

  const nativeDate = new Date(trimmed);
  if (!Number.isNaN(nativeDate.getTime())) {
    return {
      scheduledAt: nativeDate.toISOString(),
      parsed: true,
    };
  }

  const chronoDate = chrono.parseDate(trimmed, new Date(), {
    forwardDate: true,
  });
  if (chronoDate) {
    return {
      scheduledAt: chronoDate.toISOString(),
      parsed: true,
    };
  }

  return {
    // Resend also accepts relative schedule text in some formats (for example, "in 2 days").
    scheduledAt: trimmed,
    parsed: false,
  };
}
