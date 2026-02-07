import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

  try {
    // Construct OAuth URL manually
    const apiKey = process.env.SHOPIFY_API_KEY;
    const scopes = process.env.SHOPIFY_SCOPES;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/shopify/callback`;
    
    // Sanitize shop domain
    const sanitizedShop = shop.replace(/https?:\/\//, '').replace(/\/$/, '');
    
    if (!sanitizedShop.includes('.myshopify.com')) {
      return NextResponse.json({ error: 'Invalid shop domain' }, { status: 400 });
    }
    
    // Build Shopify OAuth URL
    const authUrl = `https://${sanitizedShop}/admin/oauth/authorize?` + 
      `client_id=${apiKey}&` +
      `scope=${scopes}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${session.user.id}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Shopify connect error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate OAuth',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
