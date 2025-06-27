'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/AuthGuard'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { data: session } = useSession()

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header user={session?.user} />
          
          {/* Main Dashboard */}
          <main className="flex-1 overflow-y-auto p-6">
            <Dashboard />
          </main>
        </div>
      </div>
    </AuthGuard>
  )
} 