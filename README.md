# Mr. Advance AI Hub - Frontend

Next.js React application for the Mr. Advance AI Hub platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env` and `.env.local` files in this directory:

### `.env`
```bash
# MongoDB Configuration
DATABASE_URL="mongodb+srv://zy:12345678%40Y@chathistory.mongocluster.cosmos.azure.com/mradvance?retryWrites=true&w=majority&appName=chathistory"
```

### `.env.local`
```bash
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

## Project Structure

```
frontend/
├── app/              # Next.js app router
│   ├── api/         # API routes
│   ├── login/       # Login page
│   ├── register/    # Registration page
│   ├── agent-garden/ # Agent Garden page
│   ├── risk-management/ # Risk management & chatbot
│   └── ...
├── components/       # Reusable React components
├── lib/             # Utility libraries
├── public/          # Static assets
├── types/           # TypeScript definitions
└── prisma/          # Database schema
```

## Features

- **Authentication**: NextAuth.js with email verification
- **Database**: MongoDB with Prisma ORM
- **UI**: Tailwind CSS with responsive design
- **TypeScript**: Full type safety
- **Domain Restrictions**: Email domain validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database admin UI
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database

## Backend Integration

The frontend communicates with the Python Flask backend running on `http://localhost:5000` for AI risk assessment features. 