import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_ADS_CLIENT_ID,
  process.env.GOOGLE_ADS_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/integrations/google-ads/callback`
);

export interface GoogleAdsMetrics {
  date: string;
  cost: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

export function getGoogleAdsAuthUrl(state: string): string {
  const scopes = [
    'https://www.googleapis.com/auth/adwords'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: state,
    prompt: 'consent'
  });
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getGoogleAdsCost(
  customerId: string,
  refreshToken: string,
  startDate: Date,
  endDate: Date
): Promise<GoogleAdsMetrics[]> {
  // Set the refresh token
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  // Get a fresh access token
  const { credentials } = await oauth2Client.refreshAccessToken();
  const accessToken = credentials.access_token;

  // Format dates for Google Ads API (YYYY-MM-DD)
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  // Google Ads API query
  const query = `
    SELECT 
      segments.date,
      metrics.cost_micros,
      metrics.clicks,
      metrics.impressions,
      metrics.conversions
    FROM campaign
    WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
  `;

  try {
    // Make request to Google Ads API
    const response = await fetch(
      `https://googleads.googleapis.com/v15/customers/${customerId}/googleAds:searchStream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      }
    );

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process and aggregate results by date
    const metricsMap = new Map<string, GoogleAdsMetrics>();

    for (const result of data) {
      const date = result.segments?.date;
      const costMicros = parseFloat(result.metrics?.cost_micros || '0');
      const clicks = parseInt(result.metrics?.clicks || '0');
      const impressions = parseInt(result.metrics?.impressions || '0');
      const conversions = parseFloat(result.metrics?.conversions || '0');

      if (!metricsMap.has(date)) {
        metricsMap.set(date, {
          date,
          cost: 0,
          clicks: 0,
          impressions: 0,
          conversions: 0
        });
      }

      const metrics = metricsMap.get(date)!;
      metrics.cost += costMicros / 1_000_000; // Convert micros to currency
      metrics.clicks += clicks;
      metrics.impressions += impressions;
      metrics.conversions += conversions;
    }

    return Array.from(metricsMap.values());
  } catch (error) {
    console.error('Error fetching Google Ads data:', error);
    return [];
  }
}

export { oauth2Client };
