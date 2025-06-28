import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

// Singleton pattern for Prisma in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
    console.log('Registration attempt started')
    
    // Test database connection first
    await prisma.$connect()
    console.log('Database connected successfully for registration')

    const { firstName, lastName, email, company, password } = await request.json()
    
    console.log('Registration data received:', { firstName, lastName, email, company, passwordLength: password?.length })

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email domain
    const emailDomain = email.split('@')[1]?.toLowerCase()
    console.log('Email domain:', emailDomain)
    
    if (!ALLOWED_DOMAINS.includes(emailDomain)) {
      console.log('Invalid email domain:', emailDomain)
      return NextResponse.json(
        { 
          error: `Registration is restricted to ${ALLOWED_DOMAINS.join(', ')} email addresses only.`,
          allowedDomains: ALLOWED_DOMAINS
        },
        { status: 403 }
      )
    }

    // Check if user already exists
    console.log('Checking for existing user...')
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    console.log('Creating new user...')
    
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

    console.log('User created successfully:', user.email)

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
      console.log('Verification email sent successfully')
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails, but log it
    }

    // Return user without password and verification token
    const { password: _, verificationToken: __, ...userWithoutPassword } = user

    console.log('Registration completed successfully for:', email)

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email for a verification code.',
        user: userWithoutPassword,
        requiresVerification: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error details:', error)
    
    // Provide more specific error information
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 