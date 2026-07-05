const STORAGE_KEY = 'spro-country-preference';
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getCountryPreference() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.countryId || !parsed?.savedAt) {
      return null;
    }

    if (Date.now() - parsed.savedAt > TEN_DAYS_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getCountryId() {
  return getCountryPreference()?.countryId ?? null;
}

export function hasValidCountryPreference() {
  return Boolean(getCountryId());
}

export function saveCountryPreference(country) {
  if (!isBrowser() || !country?.id) {
    return null;
  }

  const preference = {
    countryId: country.id,
    countryName: country.cont_name,
    contCode: country.cont_code,
    contConn: country.cont_conn,
    savedAt: Date.now(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  return preference;
}

export function clearCountryPreference() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
