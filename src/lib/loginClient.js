'use client';

export async function loginUser({ countryId, username, password }) {
  const apiUrl = '/api/report/user-login';
  const payload = {
    country_id: Number(countryId),
    username,
    password,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Login request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
