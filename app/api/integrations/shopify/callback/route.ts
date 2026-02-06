import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shopify } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request as any,
    });

    const { session: shopifySession } = callbackResponse;

    // Store the Shopify credentials
    await prisma.store.create({
      data: {
        userId: session.user.id,
        shopifyDomain: shopifySession.shop,
        shopifyAccessToken: shopifySession.accessToken!,
        shopifyShopId: shopifySession.id,
        name: shopifySession.shop,
        isActive: true,
      }
    });

    return NextResponse.redirect(new URL('/dashboard?connected=shopify', request.url));
  } catch (error) {
    console.error('Shopify callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=shopify_connection', request.url));
  }
}
