import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shopify } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Shop parameter required' }, { status: 400 });
  }

  // Generate authorization URL - Shopify API v9+ requires rawRequest
  const sanitizedShop = shopify.utils.sanitizeShop(shop, true);
  
  if (!sanitizedShop) {
    return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
  }

  const authUrl = await shopify.auth.begin({
    shop: sanitizedShop,
    callbackPath: '/api/integrations/shopify/callback',
    isOnline: false,
    rawRequest: request as any,
  });

  return NextResponse.json({ authUrl });
}
