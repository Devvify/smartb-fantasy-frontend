// API configuration and endpoints
const API_BASE_URL = 'https://au.testing.smartb.com.au';

/**
 * Fetch sport by sportTypeId
 * @param {number} sportTypeId - The sport type ID
 */
export async function fetchSportBySportTypeId(sportTypeId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/sports/sport?sportTypeId=${sportTypeId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching sport with sportTypeId ${sportTypeId}:`, error);
    throw error;
  }
}
