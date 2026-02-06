# ProfitTracker - E-commerce Profit Analytics SaaS

A complete SaaS application for e-commerce store owners to track real-time profit and margins by connecting Shopify and Google Ads.

## 🎯 What This Application Does

- **Shopify Integration**: Automatically syncs orders, products, and costs
- **Google Ads Integration**: Pulls ad spend data to calculate true profit
- **Real-time Dashboard**: Beautiful charts showing revenue, profit, and margins
- **Order Tracking**: See profit/margin for each individual order
- **Subscription Billing**: Monthly subscription plans via Stripe (Basic $29/mo, Pro $79/mo)

## 📋 Prerequisites

Before you start, you need to create accounts with these services:

1. **Vercel Account** (for hosting) - https://vercel.com
2. **PostgreSQL Database** (recommend Railway or Supabase) - https://railway.app or https://supabase.com
3. **Shopify Partner Account** - https://partners.shopify.com
4. **Google Cloud Account** (for Ads API) - https://console.cloud.google.com
5. **Stripe Account** (for payments) - https://stripe.com

## 🚀 Step-by-Step Deployment Guide

### Step 1: Create Your Accounts

#### 1.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Connect with GitHub (recommended)
4. Complete signup

#### 1.2 Create Database (Using Railway)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Provision PostgreSQL"
5. Once created, click on PostgreSQL
6. Go to "Connect" tab
7. Copy the "Postgres Connection URL" - save this! You'll need it as `DATABASE_URL`

#### 1.3 Create Shopify App
1. Go to https://partners.shopify.com
2. Sign up/login
3. Click "Apps" → "Create app"
4. Choose "Public app"
5. Enter app name: "ProfitTracker"
6. In App URL, enter: `https://your-app-name.vercel.app` (we'll update this later)
7. In Allowed redirection URLs, add: `https://your-app-name.vercel.app/api/integrations/shopify/callback`
8. Under "API credentials":
   - Copy "Client ID" - this is your `SHOPIFY_API_KEY`
   - Copy "Client secret" - this is your `SHOPIFY_API_SECRET`
9. Under "API scopes", select:
   - `read_orders`
   - `read_products`
   - `read_inventory`

#### 1.4 Setup Google Ads API
1. Go to https://console.cloud.google.com
2. Create new project: "ProfitTracker"
3. Enable Google Ads API:
   - Go to "APIs & Services" → "Library"
   - Search "Google Ads API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `https://your-app-name.vercel.app/api/integrations/google-ads/callback`
   - Copy "Client ID" - this is `GOOGLE_ADS_CLIENT_ID`
   - Copy "Client secret" - this is `GOOGLE_ADS_CLIENT_SECRET`
5. Get Developer Token:
   - Go to https://ads.google.com
   - Click Tools → Setup → API Center
   - Request developer token (may take a few days for approval)
   - Copy token - this is `GOOGLE_ADS_DEVELOPER_TOKEN`

#### 1.5 Setup Stripe
1. Go to https://stripe.com
2. Sign up/login
3. Go to Developers → API keys
4. Copy "Secret key" - this is `STRIPE_SECRET_KEY`
5. Copy "Publishable key" - this is `STRIPE_PUBLISHABLE_KEY`
6. Create products:
   - Go to Products → Add product
   - Create "Basic Plan" - $29/month
   - Copy the price ID - this is `STRIPE_PRICE_ID_BASIC`
   - Create "Pro Plan" - $79/month
   - Copy the price ID - this is `STRIPE_PRICE_ID_PRO`
7. Setup webhook:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-app-name.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy "Signing secret" - this is `STRIPE_WEBHOOK_SECRET`

### Step 2: Download and Prepare the Code

The code files I've created need to be uploaded to GitHub. Here's how:

1. Download all the files I created (I'll provide them in a moment)
2. Install Git on your computer if you haven't already
3. Create a new repository on GitHub:
   - Go to https://github.com
   - Click "New repository"
   - Name it "profit-tracker"
   - Make it private
   - Click "Create repository"

### Step 3: Upload Code to GitHub

Open your terminal/command prompt and run these commands:

```bash
# Navigate to where you downloaded the files
cd path/to/profit-tracker

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/profit-tracker.git

# Push to GitHub
git push -u origin main
```

### Step 4: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository (profit-tracker)
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
5. Add Environment Variables (click "Environment Variables"):

```
DATABASE_URL=your-railway-postgres-url
NEXTAUTH_SECRET=run-this-command-to-generate: openssl rand -base64 32
NEXTAUTH_URL=https://your-app-name.vercel.app
SHOPIFY_API_KEY=your-shopify-client-id
SHOPIFY_API_SECRET=your-shopify-client-secret
SHOPIFY_SCOPES=read_orders,read_products,read_inventory
GOOGLE_ADS_CLIENT_ID=your-google-client-id
GOOGLE_ADS_CLIENT_SECRET=your-google-client-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
NODE_ENV=production
```

6. Click "Deploy"

### Step 5: Initialize Database

After deployment completes:

1. Go to your Vercel project
2. Click "Settings" → "Functions"
3. Under "Build & Development Settings", find "Install Command"
4. We need to run Prisma migrations

The easiest way is to install Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run database migration
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### Step 6: Update Callback URLs

Now that you have your Vercel URL:

1. **Update Shopify App**:
   - Go to Shopify Partners
   - Edit your app
   - Update App URL to: `https://your-actual-vercel-url.vercel.app`
   - Update redirect URL to: `https://your-actual-vercel-url.vercel.app/api/integrations/shopify/callback`

2. **Update Google OAuth**:
   - Go to Google Cloud Console
   - Edit OAuth credentials
   - Update redirect URI to: `https://your-actual-vercel-url.vercel.app/api/integrations/google-ads/callback`

3. **Update Stripe Webhook**:
   - Go to Stripe Dashboard
   - Edit webhook endpoint to: `https://your-actual-vercel-url.vercel.app/api/webhooks/stripe`

### Step 7: Test Your Application

1. Visit your Vercel URL
2. Click "Get Started"
3. Create an account
4. Connect your Shopify store
5. Sync orders
6. Connect Google Ads (optional)

## 📊 How to Use

1. **Connect Shopify**: Enter your store domain to authorize access
2. **Sync Orders**: Click "Sync Orders" to pull historical data
3. **View Dashboard**: See real-time profit metrics and charts
4. **Connect Google Ads**: Add ad spend data for true profit calculation
5. **Monitor**: Dashboard updates automatically as new orders come in

## 🛠️ Local Development

If you want to run this locally for testing:

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

Visit http://localhost:3000

## 🔧 Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Make sure Prisma migrations ran successfully

### "Shopify connection failed"
- Verify callback URL matches exactly in Shopify app settings
- Check API credentials are correct

### "Google Ads not working"
- Make sure developer token is approved
- Verify OAuth redirect URI is correct
- Customer ID must be entered manually after connection

### "Stripe webhooks not firing"
- Check webhook URL is correct
- Verify webhook secret matches
- Test webhook in Stripe Dashboard

## 📝 Important Notes

- **Developer Token**: Google Ads developer token can take 24-48 hours for approval
- **Test Mode**: Stripe starts in test mode - use test card: 4242 4242 4242 4242
- **Costs**: Shopify inventory cost must be set in your Shopify admin for accurate profit calculation
- **Sync Frequency**: Orders are synced manually or can be automated with cron jobs

## 🎓 Need Help?

If you get stuck at any step:
1. Check the error messages in Vercel deployment logs
2. Verify all environment variables are set correctly
3. Make sure callback URLs match exactly
4. Test each integration separately

## 📦 What's Included

- ✅ Complete authentication system
- ✅ Shopify OAuth integration
- ✅ Google Ads API integration
- ✅ Real-time profit calculation
- ✅ Beautiful dashboard with charts
- ✅ Order tracking
- ✅ Subscription billing ready
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Production-ready code

## 🚀 Next Steps

After deployment:
1. Customize branding (colors, fonts, logo)
2. Set up automated order syncing (cron job)
3. Add more integrations (Facebook Ads, TikTok Ads)
4. Enable subscription payments
5. Add email notifications
6. Implement advanced analytics

Good luck with your SaaS! 🎉
