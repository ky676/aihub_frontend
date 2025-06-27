import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Allowed email domains
const ALLOWED_DOMAINS = [
  'mradvancellc.com',
  'nyu.edu', 
  'nyulangone.org'
]

// Simple email sending function (you can replace with SendGrid, AWS SES, etc.)
async function sendVerificationEmail(email: string, verificationCode: string) {
  // For now, we'll just log it - replace with actual email service
  console.log(`
    ========================================
    VERIFICATION EMAIL FOR: ${email}
    ========================================
    
    Welcome to Mr. Advance AI Hub!
    
    Your verification code is: ${verificationCode}
    
    This code will expire in 24 hours.
    
    Enter this code on the verification page to complete your registration.
    
    ========================================
  `)
  
  // TODO: Replace with actual email service
  // Example with SendGrid:
  // await sgMail.send({
  //   to: email,
  //   from: 'noreply@mradvancellc.com',
  //   subject: 'Verify your Mr. Advance AI Hub account',
  //   text: `Your verification code is: ${verificationCode}`,
  //   html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
  // })
  
  return true
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, company, password } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email domain
    const emailDomain = email.split('@')[1]?.toLowerCase()
    if (!ALLOWED_DOMAINS.includes(emailDomain)) {
      return NextResponse.json(
        { 
          error: `Registration is restricted to ${ALLOWED_DOMAINS.join(', ')} email addresses only.`,
          allowedDomains: ALLOWED_DOMAINS
        },
        { status: 403 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification code (6-digit number)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiration to 24 hours from now
    const verificationExpires = new Date()
    verificationExpires.setHours(verificationExpires.getHours() + 24)

    // Create user (unverified)
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        company: company,
        password: hashedPassword,
        emailVerified: false,
        verificationToken: verificationCode,
        verificationExpires: verificationExpires,
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails, but log it
    }

    // Return user without password and verification token
    const { password: _, verificationToken: __, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email for a verification code.',
        user: userWithoutPassword,
        requiresVerification: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 