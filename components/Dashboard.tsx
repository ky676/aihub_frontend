'use client'

import React from 'react'
import { 
  Phone, 
  Shield, 
  Bot, 
  BarChart3, 
  TrendingUp, 
  Users,
  ArrowRight,
  Activity
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Active AI Agents', value: '12', change: '+2.5%', icon: Bot },
    { label: 'Risk Assessments', value: '1,247', change: '+12.3%', icon: Shield },
    { label: 'Call Interactions', value: '8,592', change: '+8.7%', icon: Phone },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Activity },
  ]

  const services = [
    {
      title: 'Call Agent',
      description: 'Access AI-powered call assistance and customer service tools',
      icon: Phone,
      features: ['Voice Assistant', 'Call Analytics', 'Customer Insights'],
      href: '/call-agent',
      color: 'bg-blue-500'
    },
    {
      title: 'Risk Management',
      description: 'Run risk assessments and access financial analysis tools',
      icon: Shield,
      features: ['Risk Assessment', 'Fraud Analysis', 'Compliance Reports'],
      href: '/risk-management',
      color: 'bg-red-500'
    },
    {
      title: 'Agent Garden',
      description: 'Access available AI agents for your daily tasks',
      icon: Bot,
      features: ['Available Agents', 'Task Automation', 'Workflow Integration'],
      href: '/agent-garden',
      color: 'bg-green-500'
    }
  ]

  const recentActivities = [
    { 
      id: 1, 
      title: 'Risk Assessment Completed', 
      description: 'High-priority loan application processed',
      time: '2 minutes ago',
      type: 'risk'
    },
    { 
      id: 2, 
      title: 'Call Agent Performance Update', 
      description: 'Customer satisfaction increased to 94.2%',
      time: '15 minutes ago',
      type: 'call'
    },
    { 
      id: 3, 
      title: 'New Agent Deployed', 
      description: 'Financial advisor bot is now live',
      time: '1 hour ago',
      type: 'agent'
    },
    { 
      id: 4, 
      title: 'System Health Check', 
      description: 'All services operating normally',
      time: '2 hours ago',
      type: 'system'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Mr. Advance AI Hub</h1>
        <p className="text-lg opacity-90">
          Access AI-powered tools and services to enhance your workflow
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button className="bg-white text-primary-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Explore Services
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-primary-600 transition-colors">
            View User Guide
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <IconComponent className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Services */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Services</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <div key={service.title} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 ${service.color} rounded-lg mr-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={service.href}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Access Service
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">Run Risk Assessment</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">Start Call Session</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">Access AI Assistant</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">View My Reports</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 