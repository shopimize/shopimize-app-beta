// GDPR Compliance Utilities
// Handles data encryption, consent management, and privacy requirements

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive data (API keys, tokens, etc.)
 * EU GDPR Article 32: Security of processing
 */
export function encryptData(text: string): string {
  if (!text) return '';
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedText: string): string {
  if (!encryptedText) return '';
  
  try {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data (one-way, for storage)
 */
export function hashData(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * GDPR Consent Types
 */
export enum ConsentType {
  GDPR_GENERAL = 'gdpr_general',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  DATA_PROCESSING = 'data_processing',
}

/**
 * Check if user has given specific consent
 */
export function hasConsent(user: any, consentType: ConsentType): boolean {
  switch (consentType) {
    case ConsentType.GDPR_GENERAL:
      return user.gdprConsent === true;
    case ConsentType.MARKETING:
      return user.marketingConsent === true;
    case ConsentType.DATA_PROCESSING:
      return user.dataProcessingConsent === true;
    default:
      return false;
  }
}

/**
 * Anonymize personal data (for analytics while respecting privacy)
 */
export function anonymizeEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.slice(0, 2) + '*****';
  return `${maskedUsername}@${domain}`;
}

/**
 * Data retention check
 * GDPR Article 5: Storage limitation
 */
export function shouldDeleteData(createdAt: Date, retentionDays: number = 90): boolean {
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceCreation > retentionDays;
}

/**
 * Generate audit log entry
 * GDPR Article 30: Records of processing activities
 */
export interface AuditLogEntry {
  userId: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export async function createAuditLog(
  prisma: any,
  entry: AuditLogEntry
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      metadata: entry.metadata,
    },
  });
}

/**
 * Cookie consent categories
 */
export enum CookieCategory {
  NECESSARY = 'necessary',     // Can't be disabled
  ANALYTICS = 'analytics',      // Google Analytics, etc.
  MARKETING = 'marketing',      // Ad pixels, retargeting
  FUNCTIONAL = 'functional',    // User preferences
}

/**
 * Default cookie consent (only necessary cookies)
 */
export const DEFAULT_COOKIE_CONSENT = {
  [CookieCategory.NECESSARY]: true,
  [CookieCategory.ANALYTICS]: false,
  [CookieCategory.MARKETING]: false,
  [CookieCategory.FUNCTIONAL]: false,
};

/**
 * Validate email for data export/deletion requests
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
