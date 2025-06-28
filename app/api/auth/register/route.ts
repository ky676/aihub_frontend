import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

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

// Configure nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Real email sending function with nodemailer
async function sendVerificationEmail(email: string, verificationCode: string) {
  try {
    console.log('Attempting to send verification email to:', email)
    
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your Mr. Advance AI Hub account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Mr. Advance AI Hub!</h2>
          <p>Thank you for registering. Please verify your email address to complete your registration.</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h3 style="color: #333; margin: 0;">Your Verification Code:</h3>
            <h1 style="color: #007bff; font-size: 32px; margin: 10px 0; letter-spacing: 3px;">${verificationCode}</h1>
          </div>
          
          <p>This code will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #888; font-size: 12px;">This email was sent from Mr. Advance AI Hub</p>
        </div>
      `,
      text: `
        Welcome to Mr. Advance AI Hub!
        
        Your verification code is: ${verificationCode}
        
        This code will expire in 24 hours.
        
        Enter this code on the verification page to complete your registration.
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    return true
    
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    
    // Fallback: Log to console for debugging
    console.log(`
      ========================================
      FALLBACK - VERIFICATION EMAIL FOR: ${email}
      ========================================
      
      Your verification code is: ${verificationCode}
      
      (Email delivery failed, using console log as fallback)
      ========================================
    `)
    
    // Don't throw error - let registration continue
    return false
  }
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

    // Send verification email with nodemailer
    const emailSent = await sendVerificationEmail(email, verificationCode)
    
    if (emailSent) {
      console.log('✅ Verification email sent successfully')
    } else {
      console.log('⚠️ Email sending failed, but registration completed')
    }

    // Return user without password and verification token
    const { password: _, verificationToken: __, ...userWithoutPassword } = user

    console.log('Registration completed successfully for:', email)

    return NextResponse.json(
      { 
        message: emailSent 
          ? 'Registration successful! Please check your email for a verification code.'
          : 'Registration successful! Check the server logs for your verification code (email delivery failed).',
        user: userWithoutPassword,
        requiresVerification: true,
        emailSent: emailSent
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