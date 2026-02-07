# 🛍️ Connecting Shopify Demo Store to Shopimize

## What You Need

To connect a Shopify store to your Shopimize app, you'll need:

1. **A Shopify Development Store** (FREE - we'll create one)
2. **Your Shopify App configured properly** (already created)
3. **Correct redirect URLs** (we'll fix these)

---

## Step 1: Create a Shopify Development Store

### Why a Development Store?
- It's **100% FREE**
- You get full access to test with real data
- You can add test products and orders
- Perfect for testing your app

### How to Create One:

1. Go to https://partners.shopify.com
2. Click **"Stores"** in left sidebar
3. Click **"Add store"** button
4. Select **"Development store"**
5. Fill in:
   - **Store name**: `shopimize-test-store` (or whatever you want)
   - **Store purpose**: "Test app or theme"
   - Check "Create test data" ✅ (this adds sample products and orders!)
6. Click **"Create development store"**

**You'll get a store URL like:** `shopimize-test-store.myshopify.com`

---

## Step 2: Fix Your Shopify App Redirect URLs

Remember the Shopify app configuration issue? Let's fix it now!

### Find Your App Configuration:

1. Go to https://partners.shopify.com
2. Click **"Apps"** in left sidebar  
3. Click your app: **"Shopimize - Profit Analytics"**
4. Click **"Versions"** in left sidebar
5. You should see: `shop-optimize-profit-45` (Active)
6. Click on it OR click **"Create a version"** if you want a fresh one

### Update the Redirect URLs:

You saw this screen before! Now we know what to put:

**In the "Redirect URLs" field, add:**
```
https://shopimize-app-beta-6dbu.vercel.app/api/integrations/shopify/callback
```

(Replace `shopimize-app-beta-6dbu.vercel.app` with YOUR actual Vercel URL)

### Also Update "App URL":

Scroll down to find the **"URLs"** section and set:

**Application URL:**
```
https://shopimize-app-beta-6dbu.vercel.app
```

**Save/Release the version!**

---

## Step 3: Test the Connection

### Method A: Install Directly on Your Dev Store

1. In Shopify Partners, go to **"Stores"**
2. Click on your development store
3. Click **"Log in"** to access the store admin
4. In the store admin, go to **"Apps"** in left sidebar
5. Click **"Develop apps"** at the top
6. Click **"Allow custom app development"**
7. Click **"Create an app"**
8. Name it "Shopimize Test"
9. Click **"Configure Admin API scopes"**
10. Check these permissions:
    - `read_orders`
    - `read_products`
    - `read_inventory`
11. Click **"Save"**
12. Click **"Install app"**
13. Copy the **"Admin API access token"** - you'll need this!

### Method B: Use the OAuth Flow (Recommended)

This tests your actual OAuth integration:

1. **Go to your Shopimize app**
2. Login with your account
3. Click **"Connect Shopify Store"**
4. When prompted, enter your store URL:
   ```
   shopimize-test-store.myshopify.com
   ```
5. You'll be redirected to Shopify to approve
6. Click **"Install app"** on Shopify
7. You'll be redirected back to your dashboard!

**If this works:** ✅ Your integration is perfect!

**If it doesn't work:**
- Check the browser console for errors
- Check Vercel logs
- Make sure redirect URLs match EXACTLY

---

## Step 4: Add Test Data to Your Dev Store

Your dev store might be empty. Let's add some test data!

### Add Sample Products:

1. In Shopify Admin, go to **"Products"**
2. Click **"Add product"**
3. Add a few products with:
   - Title
   - Price
   - Cost per item (important for profit tracking!)
   - Inventory quantity

### Create Test Orders:

1. Go to **"Orders"**
2. Click **"Create order"**
3. Add products, set customer info
4. Mark as "Paid"
5. Create 5-10 test orders

**OR use Shopify's test data generator:**
- When creating the dev store, check "Fill store with test data"
- This auto-creates products, customers, and orders!

---

## Step 5: Sync Your Data

Once connected:

1. Go to your Shopimize dashboard
2. Click **"Sync Orders"** button
3. Watch the magic happen! 🎉

You should see:
- Recent orders populating
- Revenue and profit calculations
- Margin percentages
- Beautiful charts!

---

## Troubleshooting Common Issues

### "Shop domain is invalid"
- Make sure you're entering the full `.myshopify.com` URL
- Example: `shopimize-test-store.myshopify.com`

### "Redirect URI mismatch"
- Your Vercel URL in the Shopify app MUST match your actual Vercel URL
- No trailing slashes
- Must be HTTPS

### "Installation failed"
- Check Vercel runtime logs
- Look for errors in browser console
- Make sure DATABASE_URL is set correctly in Vercel

### OAuth window closes immediately
- This means redirect URL is wrong
- Go back to Shopify Partners → App → Versions → Update redirect URLs
- Make sure it's: `https://your-vercel-url.vercel.app/api/integrations/shopify/callback`

---

## What You'll Get After Connection

Once connected, Shopimize will:

1. ✅ Fetch all your orders
2. ✅ Calculate product costs from inventory
3. ✅ Compute profit margins
4. ✅ Display revenue trends
5. ✅ Show recent orders with profit data
6. ✅ Generate daily metrics

**But you won't see ad spend yet** - that requires Google Ads integration (next step!)

---

## Next Steps After Shopify is Connected

1. **Test the sync** - Make sure data is flowing
2. **Add Google Ads** - Connect your Google Ads account to see TRUE profit (including ad spend)
3. **Customize** - Adjust the dashboard to your needs
4. **Go Live** - Once tested, connect your real Shopify store!

---

## Quick Checklist

- [ ] Created Shopify development store
- [ ] Updated Shopify app redirect URLs with Vercel URL
- [ ] Saved/released the app version
- [ ] Tested OAuth connection flow
- [ ] Added test products and orders
- [ ] Successfully synced data
- [ ] See orders and profit in dashboard

**Need help?** Check the errors in:
- Browser console (F12)
- Vercel runtime logs
- Shopify Partners app logs

You've got this! 🚀
