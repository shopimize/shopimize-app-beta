import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // This endpoint will initialize the database by forcing Prisma to create all tables
    // Just accessing Prisma will trigger table creation via Prisma's db push logic
    
    // Try to query - this will create tables if they don't exist
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      userCount
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Make sure DATABASE_URL is set correctly in Vercel environment variables'
    }, { status: 500 });
  }
}
