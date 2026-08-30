// Best-effort IP -> country lookup for "auto-select my country" on first
// visit. Uses ip-api.com's free, keyless endpoint; fails soft (returns
// null) on any error, timeout, or private/local IP so the caller can fall
// back to a default.
function isPrivateIp(ip) {
  const cleaned = String(ip || '').replace('::ffff:', '');
  return (
    !cleaned ||
    cleaned === '::1' ||
    cleaned.startsWith('127.') ||
    cleaned.startsWith('10.') ||
    cleaned.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(cleaned)
  );
}

async function detectCountryFromIp(ip) {
  if (isPrivateIp(ip)) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'success' && data.countryCode ? data.countryCode : null;
  } catch (e) {
    return null;
  }
}

module.exports = { detectCountryFromIp, isPrivateIp };
