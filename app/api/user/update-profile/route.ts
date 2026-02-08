import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if new email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        email,
        // If email changed, mark as unverified
        ...(email !== session.user.email && { emailVerified: false }),
      },
    });

    return NextResponse.json({
      success: true,
      message: email !== session.user.email 
        ? 'Profile updated! Please verify your new email address.' 
        : 'Profile updated successfully!',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
