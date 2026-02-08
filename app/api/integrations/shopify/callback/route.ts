import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSecureStore } from '@/lib/secure-store';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  console.log('🔵 Shopify callback started');
  
  const session = await getServerSession(authOptions);
  console.log('🔵 Session:', session ? `User ID: ${session.user?.id}` : 'No session');
  
  if (!session?.user?.id) {
    console.log('🔴 No session, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const hmac = searchParams.get('hmac');
  const state = searchParams.get('state');
  
  console.log('🔵 Params:', { shop, hasCode: !!code, hasHmac: !!hmac });
  
  if (!code || !shop || !hmac) {
    console.log('🔴 Missing params');
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
      console.log('🔴 HMAC verification failed');
      return NextResponse.redirect(new URL('/dashboard?error=invalid_hmac', request.url));
    }

    console.log('✅ HMAC verified');

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
      console.log('🔴 Failed to get access token:', tokenResponse.status);
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();
    console.log('✅ Got access token');

    // Store credentials using secure service (auto-encrypts)
    const store = await createSecureStore(session.user.id, {
      shopifyDomain: shop,
      shopifyAccessToken: access_token,
      shopifyShopId: shop.split('.')[0],
      name: shop,
    });

    console.log('✅ Store created/updated:', store.id);
    console.log('🔵 Redirecting to dashboard');

    return NextResponse.redirect(new URL('/dashboard?connected=shopify', request.url));
  } catch (error) {
    console.error('🔴 Shopify callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=shopify_connection', request.url));
  }
}
