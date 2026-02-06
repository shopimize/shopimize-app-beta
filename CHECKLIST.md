# 🎯 DEPLOYMENT CHECKLIST

Use this checklist to track your progress. Check off each item as you complete it!

## PHASE 1: Account Creation ⏱️ 30 min

- [ ] Created Vercel account
- [ ] Created Railway account  
- [ ] Got Railway PostgreSQL connection URL
- [ ] Created Shopify Partner account
- [ ] Created Shopify app
- [ ] Got Shopify API Key
- [ ] Got Shopify API Secret
- [ ] Created Google Cloud project
- [ ] Enabled Google Ads API
- [ ] Got Google Client ID
- [ ] Got Google Client Secret
- [ ] Requested Google Ads Developer Token (24-48hr wait)
- [ ] Created Stripe account
- [ ] Got Stripe Secret Key
- [ ] Got Stripe Publishable Key
- [ ] Created Stripe products (Basic $29, Pro $79)
- [ ] Got Stripe Price IDs
- [ ] Created Stripe webhook
- [ ] Got Stripe Webhook Secret

## PHASE 2: Code Setup ⏱️ 15 min

- [ ] Downloaded all code files
- [ ] Installed Git
- [ ] Created GitHub account (if needed)
- [ ] Created GitHub repository "profit-tracker"
- [ ] Uploaded code to GitHub

## PHASE 3: Deployment ⏱️ 20 min

- [ ] Connected Vercel to GitHub
- [ ] Imported project to Vercel
- [ ] Added all environment variables:
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_SECRET (generated)
  - [ ] NEXTAUTH_URL (add after first deploy)
  - [ ] SHOPIFY_API_KEY
  - [ ] SHOPIFY_API_SECRET
  - [ ] SHOPIFY_SCOPES
  - [ ] GOOGLE_ADS_CLIENT_ID
  - [ ] GOOGLE_ADS_CLIENT_SECRET
  - [ ] GOOGLE_ADS_DEVELOPER_TOKEN
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] STRIPE_PRICE_ID_BASIC
  - [ ] STRIPE_PRICE_ID_PRO
  - [ ] NODE_ENV
- [ ] Clicked Deploy
- [ ] Got Vercel URL
- [ ] Added NEXTAUTH_URL environment variable
- [ ] Redeployed

## PHASE 4: Update Callbacks ⏱️ 10 min

- [ ] Updated Shopify App URL
- [ ] Updated Shopify redirect URL
- [ ] Updated Google OAuth redirect URI
- [ ] Updated Stripe webhook URL

## PHASE 5: Database Setup ⏱️ 15 min

- [ ] Installed Node.js
- [ ] Installed Vercel CLI
- [ ] Logged into Vercel CLI
- [ ] Linked project
- [ ] Pulled environment variables
- [ ] Ran prisma generate
- [ ] Ran prisma db push
- [ ] Saw success message

## PHASE 6: Testing ⏱️ 10 min

- [ ] Visited Vercel URL
- [ ] Registered new account
- [ ] Logged in successfully
- [ ] Saw dashboard (even if empty)
- [ ] Tested Shopify connection
- [ ] Synced test orders
- [ ] Saw data in dashboard

## 🎉 DONE!

If all items are checked, your app is live and working!

---

## WAITING FOR...

- [ ] Google Ads Developer Token approval (check after 24-48 hours)

---

## NEXT STEPS

- [ ] Test with real Shopify store
- [ ] Connect Google Ads once approved
- [ ] Switch Stripe to live mode for real payments
- [ ] Customize branding/colors
- [ ] Add your logo
- [ ] Set up custom domain (optional)
- [ ] Configure automated syncing
- [ ] Test subscription flows

---

## NOTES

Write any issues or questions here:

_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
