const { COUNTRIES } = require('../lib/countries-data');
const { detectCountryFromIp } = require('../lib/geo');

const VALID_CODES = new Set(COUNTRIES.map((c) => c.code));
const FALLBACK_COUNTRY = 'DE';
const COOKIE_NAME = 'lj_country';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365; // 1 year

// Resolves the country to use for this request, in priority order:
// 1. an explicit ?land= query param (the user picked one right now)
// 2. the lj_country cookie (they picked one before, or we detected it before)
// 3. a fresh IP-based geolocation lookup (first-ever visit) — cached into
//    the cookie so we only do this once per visitor
// 4. a hardcoded fallback
// Sets req.effectiveCountry (an ISO code) for routes/views to use.
async function resolveCountry(req, res, next) {
  const fromQuery = req.query.land;
  if (fromQuery && VALID_CODES.has(fromQuery)) {
    req.effectiveCountry = fromQuery;
    if (req.cookies?.[COOKIE_NAME] !== fromQuery) {
      res.cookie(COOKIE_NAME, fromQuery, { maxAge: COOKIE_MAX_AGE, sameSite: 'lax' });
    }
    return next();
  }

  const fromCookie = req.cookies?.[COOKIE_NAME];
  if (fromCookie && VALID_CODES.has(fromCookie)) {
    req.effectiveCountry = fromCookie;
    return next();
  }

  const detected = await detectCountryFromIp(req.ip);
  if (detected && VALID_CODES.has(detected)) {
    req.effectiveCountry = detected;
    res.cookie(COOKIE_NAME, detected, { maxAge: COOKIE_MAX_AGE, sameSite: 'lax' });
    return next();
  }

  req.effectiveCountry = FALLBACK_COUNTRY;
  next();
}

module.exports = { resolveCountry, COOKIE_NAME };
