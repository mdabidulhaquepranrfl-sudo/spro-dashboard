export async function getCountries() {
  const response = await fetch('/api/report/get-countries?country_id=100', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load countries: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}
