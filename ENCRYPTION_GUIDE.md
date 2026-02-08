# 🔐 Data Encryption System

## Overview

All sensitive data (API tokens, access keys, refresh tokens) is encrypted at rest using AES-256-GCM encryption before storing in the database.

---

## What's Encrypted

### Automatically Encrypted:
- ✅ Shopify access tokens
- ✅ Google Ads refresh tokens
- ✅ Any future OAuth tokens
- ✅ Payment gateway API keys (when added)

### NOT Encrypted (Not Sensitive):
- User emails (needed for login/queries)
- Store names, domains
- Order data, metrics
- User IDs, timestamps

---

## How It Works

### 1. **Encryption on Write**
```typescript
// User connects Shopify store
const accessToken = "shpat_abc123..."; // Plaintext from Shopify

// Automatically encrypted before database insert
await createSecureStore(userId, {
  shopifyAccessToken: accessToken  // ← Plaintext goes in
});

// Stored in database as: "a1b2c3d4:e5f6g7h8:i9j0k1l2..." ← Encrypted
```

### 2. **Decryption on Read**
```typescript
// Retrieve store with decrypted credentials
const store = await getSecureStore(storeId, userId);

// Use decrypted token for API calls
await shopifyAPI.getOrders(
  store.shopifyDomain,
  store.credentials.shopifyAccessToken  // ← Decrypted in memory
);
```

### 3. **Never Sent to Client**
```typescript
// API returns stores WITHOUT tokens
GET /api/stores
{
  "stores": [
    {
      "id": "...",
      "name": "My Store",
      "hasShopifyToken": true,  // ← Boolean only
      // shopifyAccessToken: NEVER included
    }
  ]
}
```

---

## Encryption Algorithm

**AES-256-GCM** (Galois/Counter Mode)
- **Key size:** 256 bits (32 bytes)
- **IV (Initialization Vector):** 16 bytes, randomly generated per encryption
- **Authentication:** Built-in AEAD (Authenticated Encryption with Associated Data)
- **Format:** `{iv}:{authTag}:{ciphertext}` (hex-encoded, colon-separated)

### Why AES-256-GCM?
- ✅ Industry standard for data-at-rest encryption
- ✅ FIPS 140-2 compliant
- ✅ Provides confidentiality AND integrity
- ✅ Prevents tampering attacks
- ✅ Recommended by NIST, NSA, GDPR security guidelines

---

## Environment Variables

### Required:
```bash
ENCRYPTION_KEY=<64-character-hex-string>
```

### Generate:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important:
- ⚠️ **NEVER commit to git**
- ⚠️ **Same key across all environments** (or data becomes unreadable)
- ⚠️ **Backup the key securely** (AWS Secrets Manager, 1Password, etc.)
- ⚠️ **Rotate annually** (requires migration script)

---

## Usage

### Creating a Store (Auto-Encrypts)
```typescript
import { createSecureStore } from '@/lib/secure-store';

const store = await createSecureStore(userId, {
  shopifyDomain: 'mystore.myshopify.com',
  shopifyAccessToken: 'shpat_abc123...',  // ← Plaintext
  name: 'My Store',
});

// store.credentials.shopifyAccessToken ← Decrypted (in memory)
// Database: encrypted ✅
```

### Reading a Store (Auto-Decrypts)
```typescript
import { getSecureStore } from '@/lib/secure-store';

const store = await getSecureStore(storeId, userId);

if (store) {
  // Use decrypted credentials
  const token = store.credentials.shopifyAccessToken;
  await callShopifyAPI(token);
}
```

### Updating Credentials
```typescript
import { updateStoreCredentials } from '@/lib/secure-store';

await updateStoreCredentials(storeId, userId, {
  googleAdsRefreshToken: 'new_refresh_token',  // ← Auto-encrypted
});
```

---

## Migration

### For Existing Deployments:

#### Step 1: Add ENCRYPTION_KEY
```bash
# Generate key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to Vercel
vercel env add ENCRYPTION_KEY
```

#### Step 2: Deploy Code
```bash
git push
```

#### Step 3: Run Migration Script
```bash
# SSH into server or run locally with production DATABASE_URL
npx ts-node scripts/encrypt-existing-tokens.ts
```

This will:
- ✅ Find all plaintext tokens
- ✅ Encrypt them with new key
- ✅ Update database
- ✅ Skip already-encrypted tokens

---

## Security Best Practices

### ✅ DO:
- Use different `ENCRYPTION_KEY` for dev/staging/production
- Rotate encryption key annually
- Store key in secure vault (AWS Secrets Manager, 1Password)
- Monitor decryption failures (indicates key mismatch)
- Audit log all token access

### ❌ DON'T:
- Don't hardcode encryption key
- Don't send tokens to client (frontend)
- Don't log decrypted tokens
- Don't use same key across projects
- Don't store key in git

---

## Key Rotation

When rotating encryption key:

```typescript
import { rotateStoreEncryption } from '@/lib/secure-store';

const stores = await getUserStores(userId);

for (const store of stores) {
  await rotateStoreEncryption(
    store.id,
    userId,
    oldDecryptFunction  // Decrypt with old key
    // Will re-encrypt with new key automatically
  );
}
```

---

## Compliance

### GDPR Article 32: Security of Processing
✅ **Requirement:** Implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.

**Our Implementation:**
- AES-256-GCM encryption at rest
- Encrypted transmission (TLS)
- Access controls (user ownership checks)
- Audit logging

### PCI-DSS (if handling payment data)
While we use Stripe (PCI-compliant), if we stored payment tokens:
- ✅ Strong cryptography (AES-256)
- ✅ Key management
- ✅ Encryption at rest

---

## Troubleshooting

### "Failed to decrypt data"
**Cause:** Encryption key changed or data corrupted

**Solution:**
1. Verify `ENCRYPTION_KEY` is correct
2. Check if key was rotated
3. Run migration script if needed

### "Decryption returns garbled text"
**Cause:** Wrong encryption key

**Solution:**
1. Restore correct `ENCRYPTION_KEY`
2. Check environment (dev vs prod key mismatch)

### "Token expired" after decryption
**Cause:** OAuth token expired (not encryption issue)

**Solution:**
1. Re-authenticate with platform
2. Refresh OAuth token
3. Update store credentials

---

## Monitoring

### Metrics to Track:
- Decryption failure rate
- Token expiration rate
- Unauthorized access attempts
- Key rotation events

### Alerts:
- Alert on >1% decryption failures
- Alert on missing `ENCRYPTION_KEY`
- Alert on audit log anomalies

---

## Future Enhancements

### Planned:
- [ ] Multi-key encryption (key versioning)
- [ ] Envelope encryption (encrypt data key with master key)
- [ ] Hardware Security Module (HSM) integration
- [ ] Automated key rotation

---

## Questions?

For security concerns or questions:
- **Email:** security@shopimize.com
- **Docs:** /docs/security/encryption
