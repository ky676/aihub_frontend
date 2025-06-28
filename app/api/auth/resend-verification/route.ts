import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

// Singleton pattern for Prisma in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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

// Resend verification email function
async function sendVerificationEmail(email: string, verificationCode: string) {
  try {
    console.log('Resending verification email to:', email)
    
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
    console.log('✅ Verification email resent successfully:', result.messageId)
    return true
    
  } catch (error) {
    console.error('❌ Failed to resend email:', error)
    
    // Fallback: Log to console for debugging
    console.log(`
      ========================================
      RESEND VERIFICATION EMAIL FOR: ${email}
      ========================================
      
      Your verification code is: ${verificationCode}
      
      (Email delivery failed, using console log as fallback)
      ========================================
    `)
    
    return false
  }
}

export async function POST(request: Request) {
  try {
    console.log('Resend verification email attempt started')
    
    // Test database connection first
    await prisma.$connect()
    console.log('Database connected successfully for resend verification')

    const { email } = await request.json()
    
    console.log('Resend verification request for:', email)

    // Validate email
    if (!email) {
      console.log('Missing email')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    console.log('Looking for user...')
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('User already verified:', email)
      return NextResponse.json(
        { error: 'Email is already verified. You can sign in.' },
        { status: 400 }
      )
    }

    console.log('Generating new verification code...')
    
    // Generate new verification code (6-digit number)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiration to 24 hours from now
    const verificationExpires = new Date()
    verificationExpires.setHours(verificationExpires.getHours() + 24)

    // Update user with new verification code
    await prisma.user.update({
      where: {
        email: email
      },
      data: {
        verificationToken: verificationCode,
        verificationExpires: verificationExpires,
      }
    })

    console.log('New verification code generated for:', email)

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode)
    
    if (emailSent) {
      console.log('✅ Verification email resent successfully')
    } else {
      console.log('⚠️ Email resending failed')
    }

    console.log('Resend verification completed for:', email)

    return NextResponse.json(
      { 
        message: emailSent 
          ? 'Verification email sent! Please check your email for a new verification code.'
          : 'Verification code generated. Check the server logs (email delivery failed).',
        emailSent: emailSent
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend verification error details:', error)
    
    // Provide more specific error information
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to resend verification email',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 