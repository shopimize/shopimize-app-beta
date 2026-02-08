import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Database Migration Endpoint
 * Visit this URL once to add email verification fields to User table
 * DELETE THIS FILE after running once!
 */
export async function GET(request: NextRequest) {
  try {
    // Check if fields already exist by trying to create a test user
    // This will fail if fields don't exist
    
    console.log('🔄 Starting database migration...');
    
    // Add the new columns using raw SQL
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "verificationToken" TEXT,
      ADD COLUMN IF NOT EXISTS "verificationTokenExpiry" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "resetToken" TEXT,
      ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3)
    `;
    
    console.log('✅ Migration successful!');
    
    return NextResponse.json({
      success: true,
      message: '✅ Database migration completed successfully!',
      instructions: 'You can now delete this file: app/api/migrate/route.ts',
      fieldsAdded: [
        'emailVerified',
        'verificationToken', 
        'verificationTokenExpiry',
        'resetToken',
        'resetTokenExpiry'
      ]
    });
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Migration failed. Check logs for details.'
    }, { status: 500 });
  }
}
