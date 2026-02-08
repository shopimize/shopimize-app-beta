import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSecureStore } from '@/lib/secure-store';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const hmac = searchParams.get('hmac');
  const state = searchParams.get('state');
  
  if (!code || !shop || !hmac) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_params', request.url));
  }

  try {
    // Verify HMAC to ensure request is from Shopify
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.delete('hmac');
    const message = queryParams.toString();
    
    const generatedHash = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET!)
      .update(message)
      .digest('hex');
    
    if (generatedHash !== hmac) {
      return NextResponse.redirect(new URL('/dashboard?error=invalid_hmac', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();

    // Store credentials using secure service (auto-encrypts)
    await createSecureStore(session.user.id, {
      shopifyDomain: shop,
      shopifyAccessToken: access_token,
      shopifyShopId: shop.split('.')[0],
      name: shop,
    });

    return NextResponse.redirect(new URL('/dashboard?connected=shopify', request.url));
  } catch (error) {
    console.error('Shopify callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=shopify_connection', request.url));
  }
}
