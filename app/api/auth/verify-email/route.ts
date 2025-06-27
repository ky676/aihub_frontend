import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, verificationCode } = await request.json()

    // Validate required fields
    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Find user with matching email and verification token
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        verificationToken: verificationCode,
        emailVerified: false
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification code or email' },
        { status: 400 }
      )
    }

    // Check if verification token has expired
    if (user.verificationExpires && new Date() > user.verificationExpires) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Update user to verified status
    const verifiedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
        updatedAt: new Date()
      }
    })

    // Return success without sensitive data
    const { password: _, verificationToken: __, ...userWithoutPassword } = verifiedUser

    return NextResponse.json(
      { 
        message: 'Email verified successfully! You can now log in.',
        user: userWithoutPassword,
        verified: true
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Resend verification code
export async function PUT(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find unverified user
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        emailVerified: false
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or already verified' },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set new expiration to 24 hours from now
    const verificationExpires = new Date()
    verificationExpires.setHours(verificationExpires.getHours() + 24)

    // Update user with new verification token
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        verificationToken: verificationCode,
        verificationExpires: verificationExpires,
        updatedAt: new Date()
      }
    })

    // Send new verification email
    try {
      // For now, we'll just log it - replace with actual email service
      console.log(`
        ========================================
        RESENT VERIFICATION EMAIL FOR: ${email}
        ========================================
        
        Your new verification code is: ${verificationCode}
        
        This code will expire in 24 hours.
        
        ========================================
      `)
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError)
    }

    return NextResponse.json(
      { 
        message: 'New verification code sent! Please check your email.',
        resent: true
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 