import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://au.testing.smartb.com.au';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const contestType = searchParams.get('contestType') || 'paid';
  const status = searchParams.get('status') || '1';
  const sport = searchParams.get('sport') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  try {
    // Construct the API URL based on the actual SmartB API structure
    // Note: You'll need to inspect the Network tab to get the exact endpoint
    const apiParams = new URLSearchParams({
      contestType,
      status,
      page,
      limit,
    });

    if (sport && sport !== 'all') {
      apiParams.append('sport', sport);
    }

    const apiUrl = `${API_BASE_URL}/api/v1/fantasy/competitions?${apiParams}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SmartB-Frontend',
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      // If API fails, return mock data for development
      return NextResponse.json({
        competitions: generateMockCompetitions(parseInt(limit)),
        totalPages: 216,
        currentPage: parseInt(page),
        total: 2160,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Return mock data on error
    return NextResponse.json({
      competitions: generateMockCompetitions(parseInt(limit)),
      totalPages: 216,
      currentPage: parseInt(page),
      total: 2160,
    });
  }
}

function generateMockCompetitions(count) {
  const leagues = ['NBA', 'Premier League', 'Women\'s Big Bash League', 'AFL', 'NRL'];
  const teams = [
    'PORTLAND TRAIL BLAZERS', 'ORLANDO MAGIC', 'SACRAMENTO KINGS', 'DETROIT PISTONS',
    'NEW YORK KNICKS', 'CLEVELAND CAVALIERS', 'OKLAHOMA CITY THUNDER', 'SAN ANTONIO SPURS',
    'GOLDEN STATE WARRIORS', 'DALLAS MAVERICKS', 'LOS ANGELES LAKERS', 'HOUSTON ROCKETS',
    'DENVER NUGGETS', 'MINNESOTA TIMBERWOLVES', 'MANCHESTER UTD', 'NEWCASTLE',
    'NOTTINGHAM', 'MANCHESTER CITY', 'LIVERPOOL', 'ARSENAL'
  ];
  const statuses = ['CLOSED', 'UPCOMING', 'LIVE'];
  
  const competitions = [];
  
  for (let i = 0; i < count; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 10) - 5);
    
    competitions.push({
      id: `comp-${Date.now()}-${i}`,
      league: leagues[Math.floor(Math.random() * leagues.length)],
      homeTeam: teams[Math.floor(Math.random() * teams.length)],
      awayTeam: teams[Math.floor(Math.random() * teams.length)],
      matchDate: randomDate.toISOString(),
      matchTime: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${['00', '30'][Math.floor(Math.random() * 2)]} ${['AM', 'PM'][Math.floor(Math.random() * 2)]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      prizePool: Math.floor(Math.random() * 1000),
      entryCoins: 100,
      entries: Math.floor(Math.random() * 500),
      firstPrize: Math.floor(Math.random() * 500),
    });
  }
  
  return competitions;
}
