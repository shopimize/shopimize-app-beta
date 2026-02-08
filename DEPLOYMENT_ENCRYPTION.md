# 🚀 Encryption Deployment Checklist

## Pre-Deployment

### 1. Generate Encryption Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] Save key securely (1Password, AWS Secrets Manager, etc.)
- [ ] **NEVER commit to git**
- [ ] Document where key is stored

### 2. Environment Variables

#### Vercel:
```bash
# Production
vercel env add ENCRYPTION_KEY production

# Preview
vercel env add ENCRYPTION_KEY preview  

# Development
vercel env add ENCRYPTION_KEY development
```

#### Local .env:
```bash
ENCRYPTION_KEY=your_64_char_hex_key_here
```

- [ ] Added to Vercel (all environments)
- [ ] Added to local `.env` (not committed)
- [ ] Verified key is 64 characters (hex)

---

## Deployment Steps

### Step 1: Deploy Code
```bash
git add .
git commit -m "Add data encryption for API tokens"
git push origin main
```

- [ ] Code pushed to repository
- [ ] Vercel auto-deployed
- [ ] Deployment successful (check Vercel dashboard)

### Step 2: Verify Environment Variables
```bash
vercel env ls
```

- [ ] `ENCRYPTION_KEY` present in all environments
- [ ] No errors in deployment logs

### Step 3: Test New Connections
- [ ] Create a test account
- [ ] Connect a Shopify store
- [ ] Verify token is encrypted in database:
  ```sql
  SELECT shopifyAccessToken FROM "Store" WHERE id = 'test_store_id';
  -- Should see: "a1b2c3:d4e5f6:g7h8i9..." NOT "shpat_..."
  ```
- [ ] Sync orders successfully
- [ ] Disconnect and reconnect

---

## Migration (For Existing Data)

### Option A: Manual SQL (Simple)

If you have only a few stores:

```sql
-- ⚠️ BACKUP FIRST!
-- pg_dump -h your-host -U your-user -d your-db > backup.sql

-- Check current tokens (should be plaintext)
SELECT id, shopifyDomain, 
       substring(shopifyAccessToken, 1, 10) as token_preview 
FROM "Store";

-- Tokens will be encrypted on next update automatically
-- Just trigger a re-connection for each store
```

### Option B: Migration Script (Recommended)

Run the migration script to encrypt all existing tokens:

```bash
# From project root
npx ts-node scripts/encrypt-existing-tokens.ts
```

**Before running:**
- [ ] Database backup created
- [ ] `ENCRYPTION_KEY` set in environment
- [ ] Migration script reviewed
- [ ] Downtime window scheduled (optional, can run live)

**After running:**
- [ ] Check script output for errors
- [ ] Verify encrypted count matches store count
- [ ] Test a few stores (connect/sync)
- [ ] Monitor error logs

---

## Verification

### 1. Database Check
```sql
-- All tokens should now contain colons (encrypted format)
SELECT id, shopifyDomain,
       shopifyAccessToken LIKE '%:%:%' as is_encrypted
FROM "Store";

-- Should return true for all rows
```

### 2. Functional Tests
- [ ] Existing stores can sync orders
- [ ] New store connections work
- [ ] Dashboard loads stores correctly
- [ ] No "Failed to decrypt" errors in logs
- [ ] Metrics still calculate correctly

### 3. Audit Logs
```sql
-- Check for any decryption failures
SELECT * FROM "AuditLog" 
WHERE action LIKE '%decrypt%' 
  AND "createdAt" > NOW() - INTERVAL '1 hour';
```

---

## Rollback Plan

If something goes wrong:

### Option 1: Revert Code
```bash
git revert HEAD
git push origin main
```

### Option 2: Restore from Backup
```bash
# Restore database backup
pg_restore -h your-host -U your-user -d your-db backup.sql
```

### Option 3: Remove Encryption Key
```bash
# Temporarily disable encryption
vercel env rm ENCRYPTION_KEY production

# Users will need to reconnect stores
```

---

## Post-Deployment

### Immediate (First Hour):
- [ ] Monitor Vercel logs for errors
- [ ] Check error rates in analytics
- [ ] Test 2-3 production stores
- [ ] Verify no user complaints

### First Day:
- [ ] Review audit logs for anomalies
- [ ] Check decryption success rate
- [ ] Monitor API error rates
- [ ] Test all integration types (Shopify, Google Ads)

### First Week:
- [ ] Review security metrics
- [ ] Check for any data corruption
- [ ] Validate compliance requirements
- [ ] Update documentation

---

## Security Checklist

- [ ] Encryption key stored securely (not in code)
- [ ] Key backed up in secure location
- [ ] Different keys for dev/staging/prod
- [ ] `.env` files in `.gitignore`
- [ ] No tokens logged in plaintext
- [ ] No tokens sent to frontend
- [ ] Audit logging enabled
- [ ] Key rotation plan documented

---

## Communication

### Internal Team:
```
🔐 Security Update: API Token Encryption

What: All API tokens now encrypted at rest
When: [Date/Time]
Impact: None (transparent to users)
Action: Monitor for issues

Technical Details:
- AES-256-GCM encryption
- Automatic migration completed
- No user action required
```

### Users (if needed):
```
Security Enhancement

We've implemented additional encryption for 
your connected store credentials. This happens 
automatically - no action needed from you.

Your data remains secure and accessible.
```

---

## Troubleshooting

### Issue: "Failed to decrypt data"
**Cause:** Missing or wrong encryption key
**Fix:** Verify `ENCRYPTION_KEY` in environment

### Issue: "Store not found"
**Cause:** Migration incomplete
**Fix:** Run migration script

### Issue: Orders not syncing
**Cause:** Decryption failing
**Fix:** Check logs, verify key, test manually

### Issue: New connections failing
**Cause:** Encryption key not set
**Fix:** Add `ENCRYPTION_KEY` to environment

---

## Success Criteria

✅ **Deployment Successful When:**
- All existing stores have encrypted tokens
- New connections encrypt automatically
- No decryption errors in logs
- All integrations working normally
- Audit logs show proper encryption
- Zero user impact
- Compliance requirements met

---

## Emergency Contacts

- **DevOps:** [Your Contact]
- **Security:** security@shopimize.com
- **On-Call:** [Phone Number]

---

## Next Steps

After successful deployment:

1. **Document** key location in team wiki
2. **Schedule** first key rotation (in 1 year)
3. **Implement** monitoring alerts
4. **Review** encryption coverage (are we encrypting everything needed?)
5. **Plan** additional security enhancements

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Verification By:** _____________
