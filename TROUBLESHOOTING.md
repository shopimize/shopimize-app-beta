# 🔧 TROUBLESHOOTING GUIDE

Common issues and how to fix them.

---

## Deployment Issues

### ❌ "Build failed" on Vercel

**Cause**: Missing dependencies or configuration errors

**Fix**:
1. Check Vercel deployment logs (click on failed deployment)
2. Look for the exact error message
3. Common fixes:
   - Make sure all files uploaded to GitHub
   - Verify package.json is in root directory
   - Check all imports are correct
   - Redeploy after fixing

### ❌ "Internal Server Error" when visiting site

**Cause**: Environment variables not set or database not initialized

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Verify ALL variables are set
3. Make sure NEXTAUTH_URL matches your actual URL
4. Run database setup:
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```
5. Redeploy

---

## Database Issues

### ❌ "Can't reach database server"

**Cause**: DATABASE_URL is wrong or database is down

**Fix**:
1. Go to Railway dashboard
2. Click on PostgreSQL
3. Check if database is running (green dot)
4. Copy the connection URL again
5. Update in Vercel environment variables
6. Redeploy

### ❌ "prisma db push" fails

**Cause**: Can't connect to database or schema error

**Fix**:
1. Check DATABASE_URL in .env.local file
2. Make sure Railway database is running
3. Try:
   ```bash
   npx prisma generate
   npx prisma db push --force-reset
   ```
4. If still fails, delete and recreate Railway database

---

## Authentication Issues

### ❌ "Invalid credentials" when logging in

**Cause**: User doesn't exist or password wrong

**Fix**:
1. Create a new account with "Sign Up"
2. If forgot password, currently no reset (would need to add this feature)
3. Check browser console for errors (F12)

### ❌ Can't access /dashboard - redirects to login

**Cause**: Not properly authenticated

**Fix**:
1. Clear cookies and try logging in again
2. Check NEXTAUTH_SECRET is set
3. Check NEXTAUTH_URL matches your domain exactly
4. Make sure you're using HTTPS in production

### ❌ "CSRF token mismatch"

**Cause**: NEXTAUTH_URL doesn't match actual URL

**Fix**:
1. Verify NEXTAUTH_URL in Vercel settings
2. Should be exactly: `https://your-app.vercel.app`
3. No trailing slash
4. Must use HTTPS in production
5. Redeploy after fixing

---

## Shopify Integration Issues

### ❌ "Invalid shop domain"

**Cause**: Wrong format or typo in shop domain

**Fix**:
1. Domain must be: `storename.myshopify.com`
2. Don't include https:// or www
3. Check spelling carefully
4. Make sure store actually exists

### ❌ Shopify OAuth fails

**Cause**: Redirect URL doesn't match or API credentials wrong

**Fix**:
1. In Shopify Partners, check:
   - App URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/api/integrations/shopify/callback`
2. Must match EXACTLY
3. Check SHOPIFY_API_KEY and SHOPIFY_API_SECRET
4. Try disconnecting and reconnecting

### ❌ "Could not sync orders"

**Cause**: Missing permissions or API error

**Fix**:
1. Check Shopify app has these scopes:
   - read_orders
   - read_products
   - read_inventory
2. Reinstall app on test store
3. Check Vercel logs for specific error
4. Verify store has orders to sync

### ❌ Orders show but costs are $0

**Cause**: Product costs not set in Shopify

**Fix**:
1. In Shopify Admin → Products
2. Click each product
3. Scroll to "Inventory"
4. Set "Cost per item"
5. Save
6. Resync orders

---

## Google Ads Integration Issues

### ❌ "Developer token required"

**Cause**: Token not approved yet or not entered

**Fix**:
1. Check Google Ads API Center for approval status
2. Usually takes 24-48 hours
3. Once approved, add to environment variables
4. Redeploy

### ❌ Google OAuth fails

**Cause**: Redirect URI doesn't match

**Fix**:
1. Google Cloud Console → Credentials
2. Edit OAuth client
3. Redirect URI: `https://your-app.vercel.app/api/integrations/google-ads/callback`
4. Must match EXACTLY
5. Try reconnecting

### ❌ "Invalid customer ID"

**Cause**: Customer ID not entered or wrong format

**Fix**:
1. Get customer ID from Google Ads dashboard
2. Format: 123-456-7890 (with dashes)
3. Enter in app settings
4. Must have access to this account

### ❌ No ad spend data showing

**Cause**: No recent campaigns or connection issue

**Fix**:
1. Check Google Ads has active campaigns
2. Verify date range has data
3. Check Vercel logs for API errors
4. Reconnect Google Ads integration

---

## Stripe Issues

### ❌ Webhook not receiving events

**Cause**: Endpoint URL wrong or signing secret wrong

**Fix**:
1. Stripe Dashboard → Webhooks
2. Check endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Verify signing secret in environment variables
4. Test webhook in Stripe dashboard
5. Check Vercel logs

### ❌ "Invalid API key"

**Cause**: Wrong key or using test key in production

**Fix**:
1. Using test keys? Start with `sk_test_` and `pk_test_`
2. Production keys start with `sk_live_` and `pk_live_`
3. Get fresh keys from Stripe dashboard
4. Update in Vercel environment variables
5. Redeploy

### ❌ Subscription not activating

**Cause**: Webhook not working or price ID wrong

**Fix**:
1. Check webhook is receiving events
2. Verify price IDs match Stripe products
3. Test in Stripe dashboard with test card:
   - Card: 4242 4242 4242 4242
   - Exp: Any future date
   - CVV: Any 3 digits

---

## General Issues

### ❌ Changes not showing up

**Cause**: Old deployment cached

**Fix**:
1. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Try incognito/private window
4. Wait a few minutes for Vercel CDN

### ❌ "Module not found" errors

**Cause**: Dependencies not installed

**Fix**:
1. Check package.json exists
2. Vercel should auto-install
3. If local: `npm install`
4. Redeploy

### ❌ TypeScript errors

**Cause**: Type mismatches

**Fix**:
1. Most TypeScript errors won't prevent deployment
2. Check Vercel logs for actual error
3. Fix types in code if needed
4. Can temporarily add `// @ts-ignore` above error

---

## How to Check Logs

### Vercel Logs
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click on latest deployment
4. Click "Logs" or "Runtime Logs"
5. Look for errors in red

### Browser Console
1. Right-click page → Inspect
2. Click "Console" tab
3. Look for red errors
4. This shows frontend errors

### Railway Logs
1. Go to Railway dashboard
2. Click on PostgreSQL
3. Click "Logs" tab
4. Check for connection issues

---

## Still Stuck?

1. **Read the error message carefully** - it usually tells you what's wrong
2. **Google the exact error** - someone has probably solved it
3. **Check all URLs match exactly** - common source of issues
4. **Verify environment variables** - most issues come from here
5. **Try in incognito window** - rules out caching issues
6. **Check service status**:
   - Vercel: status.vercel.com
   - Railway: status.railway.app
   - Stripe: status.stripe.com

---

## Prevention Tips

✅ **Save everything in a secure password manager**
✅ **Use exact URLs - copy/paste, don't type**
✅ **Test each integration separately**
✅ **Keep DEPLOYMENT_GUIDE.md handy**
✅ **Check logs immediately if something fails**
✅ **Always use HTTPS in production**
✅ **Redeploy after changing environment variables**

---

## Emergency Reset

If everything is broken and you want to start fresh:

1. Delete Vercel project
2. Delete GitHub repository
3. Keep your Railway database (has your data!)
4. Start deployment guide from "PART 2"
5. Use same environment variables
6. Database will reconnect automatically

---

## Need More Help?

- Vercel Discord: vercel.com/discord
- Railway Discord: discord.gg/railway
- Shopify Community: community.shopify.com
- Stripe Support: support.stripe.com

Remember: Most issues are simple fixes - usually a typo in environment variables or mismatched URLs! 🎯
