'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/AuthGuard'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Bot, Play, Pause, Settings, Plus, Activity } from 'lucide-react'

export default function AgentGardenPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { data: session } = useSession()

  const agents = [
    {
      id: 1,
      name: 'Customer Service Bot',
      status: 'active',
      type: 'Customer Support',
      interactions: '2,453',
      uptime: '99.8%'
    },
    {
      id: 2,
      name: 'Financial Advisor',
      status: 'active',
      type: 'Financial Advisory',
      interactions: '1,234',
      uptime: '99.5%'
    },
    {
      id: 3,
      name: 'Risk Assessment Agent',
      status: 'inactive',
      type: 'Risk Analysis',
      interactions: '856',
      uptime: '98.9%'
    }
  ]

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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bot className="w-8 h-8 text-green-500 mr-3" />
                  <h1 className="text-3xl font-bold text-gray-900">Agent Garden</h1>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Request New Agent
                </button>
              </div>
              <p className="text-lg text-gray-600">
                Access available AI agents for your daily tasks
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Agents</h3>
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600">2</p>
                <p className="text-sm text-gray-600">Currently running</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Agents</h3>
                  <Bot className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">In garden</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Interactions</h3>
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-600">4,543</p>
                <p className="text-sm text-gray-600">This week</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Avg Uptime</h3>
                  <Activity className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-yellow-600">99.4%</p>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Deployed Agents</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uptime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Bot className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            agent.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.interactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.uptime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {agent.status === 'active' ? (
                            <button className="text-red-600 hover:text-red-900">
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-900">
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-900">
                            <Settings className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available AI Agents</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ready to Use</h3>
                  <p className="text-gray-600 mb-4">
                    Access AI agents that are ready for immediate use in your workflow.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-left">
                      📞 Customer Service Assistant
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-left">
                      💰 Financial Advisory Helper
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-left">
                      🛡️ Risk Analysis Assistant
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Request Access</h3>
                  <p className="text-gray-600 mb-4">
                    Need additional AI assistance? Request access to specialized agents or 
                    submit a request for new agent capabilities.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                      Request Agent Access
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      View Agent Catalog
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