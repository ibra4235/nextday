const ENDPOINT = 'https://api.ipify.org?format=json';
const TIMEOUT_MS = 8000;

function isPublicIp(value: string): boolean {
  return value.length >= 3 && value.length <= 45 && /^[0-9a-fA-F:.]+$/.test(value);
}

/** Device public IP, or an empty string when the lookup does not succeed. */
export async function fetchPublicIp(): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(ENDPOINT, { signal: controller.signal });
    if (!response.ok) {
      return '';
    }
    const body = (await response.json()) as { ip?: unknown };
    const ip = typeof body.ip === 'string' ? body.ip.trim() : '';
    return isPublicIp(ip) ? ip : '';
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}
