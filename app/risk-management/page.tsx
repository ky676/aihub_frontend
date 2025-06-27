'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/AuthGuard'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Shield, AlertTriangle, TrendingUp, FileText, MessageSquare, Bot } from 'lucide-react'

export default function RiskManagementPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
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
                <Shield className="w-8 h-8 text-red-500 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Risk Management</h1>
              </div>
              <p className="text-lg text-gray-600">
                Run risk assessments and access financial analysis tools
              </p>
            </div>

            {/* AI Risk Assessment Agent Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">AI Risk Assessment Agent</h2>
                    <p className="text-blue-100 mb-4">
                      Chat with our AI-powered risk analyst for instant insights, compliance guidance, and risk scoring
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>Real-time chat</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        <span>Risk scoring</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>Instant analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/risk-management/chatbot')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat Now</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">High Risk</h3>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-600">12</p>
                <p className="text-sm text-gray-600">Requires attention</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medium Risk</h3>
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-yellow-600">45</p>
                <p className="text-sm text-gray-600">Under review</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Low Risk</h3>
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600">189</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Assessments</h3>
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Risk Tools</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Credit Risk Assessment</h4>
                      <p className="text-sm text-gray-600">Analyze customer creditworthiness instantly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Fraud Analysis</h4>
                      <p className="text-sm text-gray-600">Check for suspicious patterns and activity</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Compliance Check</h4>
                      <p className="text-sm text-gray-600">Verify regulatory compliance requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Risk Reports</h4>
                      <p className="text-sm text-gray-600">Generate comprehensive risk analysis reports</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">
                      ✅ Risk Assessment Ready
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                      AI-powered risk analysis tools are available and ready to use. 
                      Start analyzing customer data and generating risk reports.
                    </p>
                    <button 
                      onClick={() => router.push('/risk-management/chatbot')}
                      className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
                    >
                      Start Risk Assessment
                    </button>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                      New Risk Analysis
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      Upload Customer Data
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      View Past Reports
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