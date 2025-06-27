'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Shield, 
  Bot,
  BarChart3,
  Settings,
  Home,
  Users
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname()

  const menuSections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
      ]
    },
    {
      title: 'AI Services',
      items: [
        { id: 'call-agent', label: 'Call Agent', icon: Phone, href: '/call-agent' },
        { id: 'risk-management', label: 'Risk Management', icon: Shield, href: '/risk-management' },
        { id: 'agent-garden', label: 'Agent Garden', icon: Bot, href: '/agent-garden' },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'users', label: 'User Management', icon: Users, href: '/users' },
        { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
      ]
    }
  ]

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <Image
              src="/Mr-Advance-logo-1600x900-1.png"
              alt="Mr. Advance"
              width={32}
              height={32}
              className="rounded"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Hub</h1>
              <p className="text-xs text-gray-500">Mr. Advance</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <Image
            src="/Mr-Advance-logo-1600x900-1.png"
            alt="Mr. Advance"
            width={24}
            height={24}
            className="rounded mx-auto"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors group ${
                        isActive
                          ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <IconComponent className={`w-5 h-5 ${
                        isActive ? 'text-blue-900' : 'text-gray-500'
                      } ${isCollapsed ? '' : 'mr-3'}`} />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            <p>2025 Mr. Advance</p>
            <p>AI Hub v1.0</p>
          </div>
        ) : (
          <div className="w-2 h-2 bg-mr-advance-green rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  )
}

export default Sidebar 