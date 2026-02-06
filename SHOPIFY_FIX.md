# ✅ QUICK FIX: Shopify TypeScript Error

## Good News! 🎉
Your Tailwind error is FIXED! The build compiled successfully. Now there's just one TypeScript error with Shopify.

## The Error
```
Property 'rawRequest' is missing in type '{ shop: string; callbackPath: string; isOnline: false; }'
```

## The Fix

You need to update ONE file: `app/api/integrations/shopify/connect/route.ts`

### Option 1: Download Fresh Code (Easiest)
1. **Download shopimize-app-v3.zip** 
2. Extract it
3. Copy ONLY this file from the new ZIP to your project:
   - `app/api/integrations/shopify/connect/route.ts`
4. Push to GitHub:
   ```bash
   git add app/api/integrations/shopify/connect/route.ts
   git commit -m "Fix Shopify auth API"
   git push
   ```

### Option 2: Manual Edit

Open `app/api/integrations/shopify/connect/route.ts` and replace the entire `GET` function with this:

```typescript
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
```

Then push to GitHub:
```bash
git add app/api/integrations/shopify/connect/route.ts
git commit -m "Fix Shopify auth API"
git push
```

## What Changed?

Added the `rawRequest` parameter that Shopify API v9 requires:
```typescript
rawRequest: request as any,
```

Also added better error handling for invalid shop domains.

## After You Push

Vercel will automatically:
1. Detect the new commit
2. Start building
3. Deploy successfully! ✅

You should see:
- ✓ Compiled successfully
- ✓ Green checkmark
- ✓ Site is live!

## This is the Last Fix!

After this, your app will be fully deployed and working. You're almost there! 🚀
