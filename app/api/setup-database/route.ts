import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prevent this route from being statically generated during build
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient();

    // Execute each CREATE TABLE statement separately
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Subscription" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "userId" TEXT UNIQUE NOT NULL,
          "stripeCustomerId" TEXT UNIQUE,
          "stripeSubscriptionId" TEXT UNIQUE,
          "stripePriceId" TEXT,
          "stripeCurrentPeriodEnd" TIMESTAMP(3),
          status TEXT NOT NULL DEFAULT 'inactive',
          plan TEXT NOT NULL DEFAULT 'free',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
      )`;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Store" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "userId" TEXT NOT NULL,
          "shopifyDomain" TEXT UNIQUE NOT NULL,
          "shopifyAccessToken" TEXT NOT NULL,
          "shopifyShopId" TEXT,
          "googleAdsCustomerId" TEXT,
          "googleAdsRefreshToken" TEXT,
          name TEXT NOT NULL,
          currency TEXT NOT NULL DEFAULT 'USD',
          timezone TEXT NOT NULL DEFAULT 'UTC',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "lastSyncedAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
      )`;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Order" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "storeId" TEXT NOT NULL,
          "shopifyOrderId" TEXT UNIQUE NOT NULL,
          "orderNumber" TEXT NOT NULL,
          "totalPrice" DOUBLE PRECISION NOT NULL,
          "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
          profit DOUBLE PRECISION NOT NULL DEFAULT 0,
          margin DOUBLE PRECISION NOT NULL DEFAULT 0,
          currency TEXT NOT NULL,
          "financialStatus" TEXT NOT NULL,
          "fulfillmentStatus" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL,
          "processedAt" TIMESTAMP(3),
          FOREIGN KEY ("storeId") REFERENCES "Store"(id) ON DELETE CASCADE
      )`;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "DailyMetric" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "storeId" TEXT NOT NULL,
          date DATE NOT NULL,
          revenue DOUBLE PRECISION NOT NULL DEFAULT 0,
          cost DOUBLE PRECISION NOT NULL DEFAULT 0,
          "adSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
          profit DOUBLE PRECISION NOT NULL DEFAULT 0,
          margin DOUBLE PRECISION NOT NULL DEFAULT 0,
          "orderCount" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE ("storeId", date),
          FOREIGN KEY ("storeId") REFERENCES "Store"(id) ON DELETE CASCADE
      )`;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AdSpend" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "storeId" TEXT NOT NULL,
          platform TEXT NOT NULL,
          "campaignId" TEXT,
          "campaignName" TEXT,
          date DATE NOT NULL,
          amount DOUBLE PRECISION NOT NULL,
          clicks INTEGER,
          impressions INTEGER,
          conversions INTEGER,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("storeId") REFERENCES "Store"(id) ON DELETE CASCADE
      )`;

    // Create indexes
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Store_userId_idx" ON "Store"("userId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Order_storeId_idx" ON "Order"("storeId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "DailyMetric_storeId_idx" ON "DailyMetric"("storeId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "DailyMetric_date_idx" ON "DailyMetric"(date)`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "AdSpend_storeId_idx" ON "AdSpend"("storeId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "AdSpend_date_idx" ON "AdSpend"(date)`;

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: '✅ Database initialized successfully!',
      tables: ['User', 'Subscription', 'Store', 'Order', 'DailyMetric', 'AdSpend'],
      note: 'You can now register and use the app!'
    });

  } catch (error: any) {
    console.error('Database setup error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Make sure DATABASE_URL is correctly set in Vercel environment variables'
    }, { status: 500 });
  }
}
