'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/AuthGuard'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Phone, PlayCircle, PauseCircle, Settings, BarChart3 } from 'lucide-react'

export default function CallAgentPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { data: session } = useSession()

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session?.user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Phone className="w-8 h-8 text-blue-500 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Call Agent</h1>
              </div>
              <p className="text-lg text-gray-600">
                Access AI-powered call assistance and customer service tools
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Calls</h3>
                  <PlayCircle className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">94.2%</p>
                <p className="text-sm text-blue-600">+2.1% this week</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Avg Duration</h3>
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">3.2m</p>
                <p className="text-sm text-purple-600">-15s from last week</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Call Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">AI Assistant Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Live Call Assistance</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Customer Information Lookup</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Real-time Sentiment Analysis</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Conversation Insights</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Automated Call Summaries</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <p className="text-gray-600 mb-4">
                    Access AI-powered tools to enhance your customer interactions and 
                    streamline your call workflow.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                      Start Call Session
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      View Call History
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      Access Scripts Library
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </AuthGuard>
  )
}