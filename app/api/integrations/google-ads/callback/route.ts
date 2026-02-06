import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTokensFromCode } from '@/lib/google-ads';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const storeId = searchParams.get('state'); // storeId passed as state

  if (!code || !storeId) {
    return NextResponse.redirect(new URL('/dashboard?error=google_ads_missing_params', request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(new URL('/dashboard?error=google_ads_no_refresh', request.url));
    }

    // Update store with Google Ads credentials
    // Note: Customer ID needs to be entered manually by user
    await prisma.store.update({
      where: {
        id: storeId,
        userId: session.user.id
      },
      data: {
        googleAdsRefreshToken: tokens.refresh_token
      }
    });

    return NextResponse.redirect(new URL('/dashboard?connected=google_ads', request.url));
  } catch (error) {
    console.error('Google Ads callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=google_ads_connection', request.url));
  }
}
