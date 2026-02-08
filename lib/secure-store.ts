/**
 * Secure Store Service
 * Handles encryption/decryption of sensitive store data
 * All API tokens are encrypted before storing in database
 */

import { prisma } from '@/lib/prisma';
import { encryptData, decryptData } from '@/lib/compliance/gdpr';

export interface StoreCredentials {
  shopifyDomain?: string;
  shopifyAccessToken?: string;
  shopifyShopId?: string;
  googleAdsCustomerId?: string;
  googleAdsRefreshToken?: string;
}

export interface SecureStore {
  id: string;
  userId: string;
  shopifyDomain: string;
  shopifyShopId: string | null;
  name: string;
  currency: string;
  timezone: string;
  isActive: boolean;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Decrypted credentials (never stored, only in memory)
  credentials: {
    shopifyAccessToken?: string;
    googleAdsCustomerId?: string;
    googleAdsRefreshToken?: string;
  };
}

/**
 * Create a new store with encrypted credentials
 */
export async function createSecureStore(
  userId: string,
  data: {
    shopifyDomain: string;
    shopifyAccessToken: string;
    shopifyShopId?: string;
    name: string;
    currency?: string;
    timezone?: string;
  }
): Promise<SecureStore> {
  // Encrypt sensitive data before storing
  const encryptedToken = encryptData(data.shopifyAccessToken);

  const store = await prisma.store.create({
    data: {
      userId,
      shopifyDomain: data.shopifyDomain,
      shopifyAccessToken: encryptedToken,
      shopifyShopId: data.shopifyShopId || null,
      name: data.name,
      currency: data.currency || 'USD',
      timezone: data.timezone || 'UTC',
      isActive: true,
    },
  });

  return {
    ...store,
    credentials: {
      shopifyAccessToken: data.shopifyAccessToken, // Return decrypted for immediate use
    },
  };
}

/**
 * Get store with decrypted credentials
 */
export async function getSecureStore(storeId: string, userId: string): Promise<SecureStore | null> {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) return null;

  // Decrypt sensitive fields
  const credentials: StoreCredentials = {};

  if (store.shopifyAccessToken) {
    try {
      credentials.shopifyAccessToken = decryptData(store.shopifyAccessToken);
    } catch (error) {
      console.error('Failed to decrypt Shopify token for store:', storeId);
      // Token might be corrupted or encrypted with different key
    }
  }

  if (store.googleAdsRefreshToken) {
    try {
      credentials.googleAdsRefreshToken = decryptData(store.googleAdsRefreshToken);
    } catch (error) {
      console.error('Failed to decrypt Google Ads token for store:', storeId);
    }
  }

  if (store.googleAdsCustomerId) {
    credentials.googleAdsCustomerId = store.googleAdsCustomerId;
  }

  return {
    id: store.id,
    userId: store.userId,
    shopifyDomain: store.shopifyDomain,
    shopifyShopId: store.shopifyShopId,
    name: store.name,
    currency: store.currency,
    timezone: store.timezone,
    isActive: store.isActive,
    lastSyncedAt: store.lastSyncedAt,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    credentials,
  };
}

/**
 * Get all stores for a user with decrypted credentials
 */
export async function getUserStores(userId: string): Promise<SecureStore[]> {
  const stores = await prisma.store.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return stores.map(store => {
    const credentials: StoreCredentials = {};

    if (store.shopifyAccessToken) {
      try {
        credentials.shopifyAccessToken = decryptData(store.shopifyAccessToken);
      } catch (error) {
        console.error('Failed to decrypt Shopify token for store:', store.id);
      }
    }

    if (store.googleAdsRefreshToken) {
      try {
        credentials.googleAdsRefreshToken = decryptData(store.googleAdsRefreshToken);
      } catch (error) {
        console.error('Failed to decrypt Google Ads token for store:', store.id);
      }
    }

    if (store.googleAdsCustomerId) {
      credentials.googleAdsCustomerId = store.googleAdsCustomerId;
    }

    return {
      id: store.id,
      userId: store.userId,
      shopifyDomain: store.shopifyDomain,
      shopifyShopId: store.shopifyShopId,
      name: store.name,
      currency: store.currency,
      timezone: store.timezone,
      isActive: store.isActive,
      lastSyncedAt: store.lastSyncedAt,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      credentials,
    };
  });
}

/**
 * Update store credentials (encrypts before saving)
 */
export async function updateStoreCredentials(
  storeId: string,
  userId: string,
  credentials: Partial<StoreCredentials>
): Promise<SecureStore | null> {
  // Verify ownership
  const store = await prisma.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!store) return null;

  // Prepare encrypted update data
  const updateData: any = {};

  if (credentials.shopifyAccessToken) {
    updateData.shopifyAccessToken = encryptData(credentials.shopifyAccessToken);
  }

  if (credentials.googleAdsRefreshToken) {
    updateData.googleAdsRefreshToken = encryptData(credentials.googleAdsRefreshToken);
  }

  if (credentials.googleAdsCustomerId) {
    updateData.googleAdsCustomerId = credentials.googleAdsCustomerId;
  }

  if (credentials.shopifyShopId) {
    updateData.shopifyShopId = credentials.shopifyShopId;
  }

  const updated = await prisma.store.update({
    where: { id: storeId },
    data: updateData,
  });

  return getSecureStore(storeId, userId);
}

/**
 * Delete store (securely removes all encrypted credentials)
 */
export async function deleteSecureStore(storeId: string, userId: string): Promise<boolean> {
  try {
    await prisma.store.delete({
      where: {
        id: storeId,
        userId,
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete store:', error);
    return false;
  }
}

/**
 * Rotate encryption key for a store
 * Use when ENCRYPTION_KEY changes
 */
export async function rotateStoreEncryption(
  storeId: string,
  userId: string,
  oldDecryptFn: (encrypted: string) => string
): Promise<boolean> {
  const store = await prisma.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!store) return false;

  try {
    const updates: any = {};

    // Decrypt with old key, encrypt with new key
    if (store.shopifyAccessToken) {
      const decrypted = oldDecryptFn(store.shopifyAccessToken);
      updates.shopifyAccessToken = encryptData(decrypted);
    }

    if (store.googleAdsRefreshToken) {
      const decrypted = oldDecryptFn(store.googleAdsRefreshToken);
      updates.googleAdsRefreshToken = encryptData(decrypted);
    }

    await prisma.store.update({
      where: { id: storeId },
      data: updates,
    });

    return true;
  } catch (error) {
    console.error('Failed to rotate encryption for store:', storeId, error);
    return false;
  }
}
