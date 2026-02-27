const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function isValidEmail(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  return EMAIL_PATTERN.test(value.trim());
}

export function parseNumber(value: string): number | undefined {
  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    return undefined;
  }
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? undefined : asNumber;
}

