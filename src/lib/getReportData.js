/**
 * Global API utility for fetching report data.
 * Can be called from any component.
 *
 * @param {string} endpoint - API endpoint path (appended to base URL)
 * @param {string} params   - Query string parameters (without leading '?')
 * @returns {Promise<Object>} Parsed JSON response
 *
 * Usage:
 *   import { getReportData } from '@/lib/getReportData';
 *   const data = await getReportData('daily-summary', 'country_id=&staff_id=UAE2704&zone_id=&start_date=2026-06-01&end_date=2026-06-30');
 */
export async function getReportData(endpoint, params = '') {
  const countryId = 3;
  const localUrl = `/api/report/${endpoint}`;
  const queryString = params ? `${params}&country_id=${countryId}` : `country_id=${countryId}`;
  const url = `${localUrl}?${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
