'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCountryPreference,
  hasValidCountryPreference,
  saveCountryPreference,
} from '@/lib/countryStorage';

const CountryContext = createContext(null);

export function CountryProvider({ children }) {
  const [country, setCountry] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCountry(getCountryPreference());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || pathname === '/profile') {
      return;
    }

    if (!hasValidCountryPreference()) {
      router.replace('/profile');
    }
  }, [isReady, pathname, router, country]);

  const saveCountry = useCallback((selectedCountry) => {
    const saved = saveCountryPreference(selectedCountry);
    setCountry(saved);
    return saved;
  }, []);

  const value = useMemo(
    () => ({
      country,
      countryId: country?.countryId ?? null,
      isReady,
      hasCountry: Boolean(country?.countryId),
      saveCountry,
    }),
    [country, isReady, saveCountry]
  );

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountry() {
  const context = useContext(CountryContext);

  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }

  return context;
}
