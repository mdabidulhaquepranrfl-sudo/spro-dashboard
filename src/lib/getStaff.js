'use client';

import { getCountryId } from '@/lib/countryStorage';

export async function getStaffSuggestions(query, { signal } = {}) {
  const countryId = getCountryId();
  if (!countryId) {
    throw new Error('Country ID is required to fetch staff suggestions. Please select a country in your profile.');
  }

  const url = `/api/report/get-staff?country_id=${encodeURIComponent(countryId)}&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    method: 'GET',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load staff suggestions: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}
