import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

// Singleton pattern for Prisma in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          console.log('Attempting to authenticate user:', credentials.email)
          
          // Test database connection first
          await prisma.$connect()
          console.log('Database connected successfully')

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log('User found:', user ? 'Yes' : 'No')

          if (!user) {
            console.log('User not found in database')
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            console.log('Email not verified for user:', credentials.email)
            throw new Error('Please verify your email before signing in. Check your email for a verification code.')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('Authentication successful for user:', credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw error // Re-throw to see the actual error
        } finally {
          await prisma.$disconnect()
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.company = user.company
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.company = token.company
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode to see more logs
} 