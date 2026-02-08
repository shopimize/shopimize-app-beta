/**
 * Migration Script: Encrypt Existing Store Tokens
 * 
 * Run this ONCE after deploying encryption changes to encrypt
 * all existing plaintext tokens in the database.
 * 
 * Usage:
 *   npx ts-node scripts/encrypt-existing-tokens.ts
 */

import { PrismaClient } from '@prisma/client';
import { encryptData } from '../lib/compliance/gdpr';

const prisma = new PrismaClient();

async function encryptExistingTokens() {
  console.log('🔐 Starting encryption of existing store tokens...\n');

  try {
    // Find all stores
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        shopifyDomain: true,
        shopifyAccessToken: true,
        googleAdsRefreshToken: true,
      },
    });

    console.log(`Found ${stores.length} stores to process\n`);

    let encrypted = 0;
    let skipped = 0;
    let errors = 0;

    for (const store of stores) {
      try {
        const updates: any = {};
        let needsUpdate = false;

        // Check if Shopify token needs encryption
        if (store.shopifyAccessToken) {
          // Try to detect if already encrypted
          // Encrypted tokens have format: iv:authTag:encrypted
          const isAlreadyEncrypted = store.shopifyAccessToken.includes(':');
          
          if (!isAlreadyEncrypted) {
            console.log(`Encrypting Shopify token for: ${store.shopifyDomain}`);
            updates.shopifyAccessToken = encryptData(store.shopifyAccessToken);
            needsUpdate = true;
          } else {
            console.log(`Skipping (already encrypted): ${store.shopifyDomain}`);
            skipped++;
          }
        }

        // Check if Google Ads token needs encryption
        if (store.googleAdsRefreshToken) {
          const isAlreadyEncrypted = store.googleAdsRefreshToken.includes(':');
          
          if (!isAlreadyEncrypted) {
            console.log(`Encrypting Google Ads token for: ${store.shopifyDomain}`);
            updates.googleAdsRefreshToken = encryptData(store.googleAdsRefreshToken);
            needsUpdate = true;
          }
        }

        // Update if needed
        if (needsUpdate) {
          await prisma.store.update({
            where: { id: store.id },
            data: updates,
          });
          encrypted++;
          console.log(`✅ Encrypted tokens for: ${store.shopifyDomain}\n`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error encrypting store ${store.id}:`, error);
        console.log('');
      }
    }

    console.log('\n========================================');
    console.log('🎉 Migration Complete!');
    console.log('========================================');
    console.log(`Total stores: ${stores.length}`);
    console.log(`Encrypted: ${encrypted}`);
    console.log(`Already encrypted (skipped): ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('========================================\n');

    if (errors > 0) {
      console.warn('⚠️  Some stores had errors. Please review the logs above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
encryptExistingTokens()
  .then(() => {
    console.log('✅ Migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
