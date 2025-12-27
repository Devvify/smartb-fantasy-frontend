// API configuration and endpoints
const API_BASE_URL = 'https://au.testing.smartb.com.au';

/**
 * Fetch competitions data from SmartB API
 * Based on the actual API calls from the live site
 */
export async function fetchCompetitions({ 
  contestType = 'paid', 
  status = '1',
  sport = '',
  page = 1,
  limit = 10 
} = {}) {
  try {
    const params = new URLSearchParams({
      contestType,
      status,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (sport) {
      params.append('sport', sport);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/fantasy/competitions?${params}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 } // Revalidate every 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw error;
  }
}

/**
 * Fetch sports/categories list
 */
export async function fetchSports() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fantasy/sports`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sports:', error);
    return { sports: [] };
  }
}
