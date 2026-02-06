# 🎯 SIMPLIFIED DEPLOYMENT GUIDE
## For Non-Technical Users

This guide will walk you through deploying your ProfitTracker app step-by-step. Don't worry if you've never done this before - just follow along carefully!

---

## ⏱️ Time Required: 2-3 hours (mostly waiting for accounts to be approved)

---

## PART 1: CREATE YOUR ACCOUNTS (30 minutes)

### Account 1: Vercel (Your Website Host)
**What it does**: Makes your website accessible on the internet
**Cost**: FREE for this project

1. Go to: https://vercel.com
2. Click the big "Sign Up" button
3. Click "Continue with GitHub"
4. Create a GitHub account if you don't have one (it's free)
5. Authorize Vercel to access GitHub
6. ✅ Done! Keep this tab open

### Account 2: Railway (Your Database)
**What it does**: Stores all your data (users, orders, profits)
**Cost**: FREE for up to $5/month usage (plenty for starting)

1. Go to: https://railway.app
2. Click "Login with GitHub"
3. Click "New Project"
4. Click "Provision PostgreSQL"
5. Wait 30 seconds for it to create
6. Click on the "PostgreSQL" box that appears
7. Click "Connect" tab
8. Find "Postgres Connection URL"
9. Click the copy icon next to it
10. ✅ Paste this into a notepad - label it "DATABASE_URL"

### Account 3: Shopify Partner (To Connect Stores)
**What it does**: Lets your app connect to Shopify stores
**Cost**: FREE

1. Go to: https://partners.shopify.com
2. Click "Join Now"
3. Fill out the form (use your real email)
4. Confirm your email
5. Login to Partners dashboard
6. Click "Apps" in the left menu
7. Click "Create app"
8. Click "Create app manually"
9. App name: "ProfitTracker"
10. For now, use these temporary URLs (we'll update later):
    - App URL: `https://temporary.com`
    - Allowed redirection: `https://temporary.com/callback`
11. Click "Create app"
12. Click on your app name
13. Click "Configuration"
14. Find "Client credentials" section
15. Click "Client ID" - copy it to notepad, label it "SHOPIFY_API_KEY"
16. Click "Client secret" - copy it to notepad, label it "SHOPIFY_API_SECRET"
17. Scroll down to "API access scopes"
18. Click "Configure"
19. Check these boxes:
    - read_orders
    - read_products  
    - read_inventory
20. Click "Save"
21. ✅ Done! Keep this tab open

### Account 4: Google Cloud (For Google Ads)
**What it does**: Lets your app get ad spend data
**Cost**: FREE
**Note**: This takes 24-48 hours for approval, so start early!

1. Go to: https://console.cloud.google.com
2. Click "Select a project" at the top
3. Click "New Project"
4. Name: "ProfitTracker"
5. Click "Create"
6. Wait for it to create (30 seconds)
7. Click "Select project" and choose "ProfitTracker"
8. In the search bar at top, type "Google Ads API"
9. Click on "Google Ads API"
10. Click "Enable"
11. Click the hamburger menu (☰) → "APIs & Services" → "Credentials"
12. Click "Create Credentials" → "OAuth client ID"
13. If asked, click "Configure Consent Screen"
    - Choose "External"
    - App name: "ProfitTracker"
    - User support email: your email
    - Developer contact: your email
    - Click "Save and Continue" three times
14. Back to Credentials, click "Create Credentials" → "OAuth client ID"
15. Application type: "Web application"
16. Name: "ProfitTracker Web"
17. Authorized redirect URIs - Add: `https://temporary.com/callback`
18. Click "Create"
19. Copy "Client ID" to notepad - label it "GOOGLE_ADS_CLIENT_ID"
20. Copy "Client secret" to notepad - label it "GOOGLE_ADS_CLIENT_SECRET"
21. Now get developer token:
    - Go to: https://ads.google.com
    - If you don't have Google Ads, create account
    - Click the tools icon (🔧)
    - Under "Setup", click "API Center"
    - Click "Get started" or "Request token"
    - Fill out the form
    - ⚠️ THIS TAKES 24-48 HOURS TO APPROVE
22. ✅ Once approved, copy token to notepad as "GOOGLE_ADS_DEVELOPER_TOKEN"

### Account 5: Stripe (For Payments)
**What it does**: Processes subscription payments
**Cost**: FREE (2.9% + 30¢ per transaction)

1. Go to: https://stripe.com
2. Click "Sign up"
3. Fill out form with your business info
4. Confirm your email
5. Complete verification (need business details)
6. Click "Developers" in top right
7. Click "API keys"
8. Find "Secret key" → Click "Reveal test key" → Copy it
9. Paste in notepad as "STRIPE_SECRET_KEY"
10. Find "Publishable key" → Copy it
11. Paste in notepad as "STRIPE_PUBLISHABLE_KEY"
12. Click "Products" in left menu
13. Click "Add product"
    - Name: "Basic Plan"
    - Price: $29
    - Billing period: Monthly
    - Click "Add product"
14. Click on the price under your product
15. Copy the ID that starts with "price_" 
16. Paste in notepad as "STRIPE_PRICE_ID_BASIC"
17. Go back and create another product:
    - Name: "Pro Plan"
    - Price: $79
    - Billing period: Monthly
18. Copy its price ID to notepad as "STRIPE_PRICE_ID_PRO"
19. Click "Developers" → "Webhooks"
20. Click "Add endpoint"
21. Endpoint URL: `https://temporary.com/webhook` (we'll update)
22. Click "Select events"
23. Search and check:
    - checkout.session.completed
    - customer.subscription.updated
    - customer.subscription.deleted
24. Click "Add endpoint"
25. Click on your new webhook
26. Click "Reveal" next to "Signing secret"
27. Copy to notepad as "STRIPE_WEBHOOK_SECRET"
28. ✅ Done!

---

## PART 2: UPLOAD CODE TO GITHUB (15 minutes)

### Step 1: Download the Code
You should have received all the code files. Make sure you have them in a folder called "profit-tracker"

### Step 2: Install Git
**Windows**:
1. Go to: https://git-scm.com/download/win
2. Download and install
3. Use all default settings

**Mac**:
1. Open Terminal (search for it in Spotlight)
2. Type: `git --version`
3. If not installed, follow prompts to install

### Step 3: Create GitHub Repository
1. Go to: https://github.com
2. Click "+" in top right → "New repository"
3. Name: "profit-tracker"
4. Make it "Private"
5. Click "Create repository"
6. Keep this page open - you'll need the URL

### Step 4: Upload Code
**Windows** - Open Command Prompt:
1. Press Windows + R
2. Type `cmd` and press Enter

**Mac** - Open Terminal

Then type these commands (replace YOUR-USERNAME with your GitHub username):

```bash
cd Desktop/profit-tracker

git init

git add .

git commit -m "Initial commit"

git remote add origin https://github.com/YOUR-USERNAME/profit-tracker.git

git branch -M main

git push -u origin main
```

It will ask for your GitHub username and password. 
⚠️ Note: Password is actually a "Personal Access Token"

To get a token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Check "repo" checkbox
4. Click "Generate token"
5. Copy the token and use it as your password

✅ Code is now on GitHub!

---

## PART 3: DEPLOY TO VERCEL (20 minutes)

### Step 1: Connect GitHub
1. Go back to Vercel tab
2. Click "Add New" → "Project"
3. Find your "profit-tracker" repository
4. Click "Import"

### Step 2: Configure Project
1. Framework Preset: Next.js (should auto-detect)
2. Root Directory: ./ (leave as is)
3. Click "Environment Variables"

### Step 3: Add All Your Variables
Click "Add" for each one and paste from your notepad:

```
DATABASE_URL = [paste your Railway URL]
SHOPIFY_API_KEY = [paste from notepad]
SHOPIFY_API_SECRET = [paste from notepad]
SHOPIFY_SCOPES = read_orders,read_products,read_inventory
GOOGLE_ADS_CLIENT_ID = [paste from notepad]
GOOGLE_ADS_CLIENT_SECRET = [paste from notepad]
GOOGLE_ADS_DEVELOPER_TOKEN = [paste from notepad]
STRIPE_SECRET_KEY = [paste from notepad]
STRIPE_PUBLISHABLE_KEY = [paste from notepad]
STRIPE_WEBHOOK_SECRET = [paste from notepad]
STRIPE_PRICE_ID_BASIC = [paste from notepad]
STRIPE_PRICE_ID_PRO = [paste from notepad]
NODE_ENV = production
```

For NEXTAUTH_SECRET, generate a random string:
1. Go to: https://generate-secret.vercel.app/32
2. Copy the generated string
3. Paste as NEXTAUTH_SECRET

For NEXTAUTH_URL:
- Leave blank for now, we'll add it after deployment

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. 🎉 You'll see "Congratulations!"
4. Click "Continue to Dashboard"
5. At the top, you'll see your URL like: `profit-tracker-xyz.vercel.app`
6. Copy this URL!

### Step 5: Add NEXTAUTH_URL
1. In Vercel, click "Settings"
2. Click "Environment Variables"
3. Add new variable:
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-vercel-url.vercel.app` (use your actual URL)
4. Click "Save"

### Step 6: Redeploy
1. Click "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Click "Redeploy" again to confirm

---

## PART 4: UPDATE CALLBACK URLS (10 minutes)

Now update all those temporary URLs with your real Vercel URL:

### Update Shopify
1. Go to Shopify Partners
2. Click your "ProfitTracker" app
3. Click "Configuration"
4. Update:
   - App URL: `https://your-vercel-url.vercel.app`
   - Allowed redirection: `https://your-vercel-url.vercel.app/api/integrations/shopify/callback`
5. Click "Save"

### Update Google Cloud
1. Go to Google Cloud Console
2. APIs & Services → Credentials
3. Click on your OAuth client ID
4. Under "Authorized redirect URIs":
   - Delete the temporary one
   - Add: `https://your-vercel-url.vercel.app/api/integrations/google-ads/callback`
5. Click "Save"

### Update Stripe
1. Go to Stripe Dashboard
2. Developers → Webhooks
3. Click on your webhook
4. Click "..." → Update details
5. Change endpoint URL to: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
6. Click "Update endpoint"

---

## PART 5: INITIALIZE DATABASE (15 minutes)

This is the most technical part, but just follow carefully:

### Option A: Use Vercel CLI (Recommended)

1. Install Node.js if you don't have it:
   - Go to: https://nodejs.org
   - Download LTS version
   - Install with default settings

2. Open Terminal/Command Prompt

3. Install Vercel CLI:
```bash
npm install -g vercel
```

4. Login to Vercel:
```bash
vercel login
```
(Follow the prompts - check your email)

5. Link to your project:
```bash
cd Desktop/profit-tracker
vercel link
```
(Select your project when asked)

6. Pull environment variables:
```bash
vercel env pull .env.local
```

7. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

You should see "✔ Database schema synchronized"

✅ Done!

### Option B: If CLI Doesn't Work

Contact me and I can help you set up the database directly.

---

## PART 6: TEST YOUR APP! (10 minutes)

1. Go to your Vercel URL
2. Click "Get Started"
3. Create an account with your email
4. You should see the welcome screen!
5. Click "Connect Shopify Store"
6. Enter a test Shopify store domain
7. Authorize the connection

🎉 **CONGRATULATIONS!** Your app is live!

---

## 🆘 TROUBLESHOOTING

### "Can't connect to database"
- Check your DATABASE_URL is correct in Vercel environment variables
- Make sure you ran `prisma db push`

### "Shopify authentication failed"
- Double-check the callback URL matches exactly
- Make sure API credentials are correct

### "Nothing happens when I click sync"
- Open browser console (F12) to see errors
- Check Vercel deployment logs for errors

### Deployment failed
- Check Vercel deployment logs for specific error
- Make sure all environment variables are set

---

## 📞 GET HELP

If you get stuck:
1. Check the error message carefully
2. Google the exact error message
3. Check Vercel deployment logs
4. Verify all environment variables are set correctly

---

## 🎯 WHAT'S NEXT?

Your app is live! Now you can:
1. ✅ Connect real Shopify stores
2. ✅ Sync orders and see profits
3. ✅ Connect Google Ads (once approved)
4. ✅ Enable subscriptions
5. ✅ Customize the design
6. ✅ Add your branding

**Remember**: This is a fully functional app, but you'll want to:
- Test thoroughly before accepting real payments
- Switch Stripe from test mode to live mode
- Add your own branding and logo
- Consider hiring a developer for advanced features

Good luck! 🚀
