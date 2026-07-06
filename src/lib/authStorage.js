'use client';

const STORAGE_KEY = 'spro-auth';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getAuth() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.user || !parsed?.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAuth(auth) {
  if (!isBrowser() || !auth?.user) {
    return null;
  }

  const payload = {
    ...auth,
    user: {
      ...auth.user,
      profile_pic: auth.user.profile_pic || '',
      role: auth.user.role || '',
    },
    savedAt: Date.now(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function clearAuth() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn() {
  return Boolean(getAuth()?.user);
}
