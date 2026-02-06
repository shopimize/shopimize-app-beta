import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGoogleAdsAuthUrl } from '@/lib/google-ads';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
  }

  // Use storeId as state to identify which store to update after OAuth
  const authUrl = getGoogleAdsAuthUrl(storeId);

  return NextResponse.json({ authUrl });
}
