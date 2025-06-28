'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface RiskScore {
  score: number;
  level: string;
  factors: string[];
}

export default function RiskAssessmentChatbot() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  // Add welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: `Welcome to the Mr. Advance Risk Assessment Agent! 🎯\n\nI'm here to help you with:\n •Specific question about the lender based on the data we have on the customer\n• Regulatory compliance guidance\n\nHow can I assist you today?`,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setCurrentStreamingMessage('');

    // Add streaming message placeholder
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'token' && data.token) {
                  accumulatedText += data.token;
                  setCurrentStreamingMessage(accumulatedText);
                } else if (data.type === 'complete') {
                  // Update the message and stop streaming
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === botMessageId 
                        ? { ...msg, content: accumulatedText, isStreaming: false }
                        : msg
                    )
                  );
                  setCurrentStreamingMessage('');
                } else if (data.type === 'error') {
                  throw new Error(data.error);
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { 
                ...msg, 
                content: 'Sorry, I encountered an error. Please try again or check if the backend server is running.',
                isStreaming: false
              }
            : msg
        )
      );
      setCurrentStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const calculateRiskScore = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/risk-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          factors: {
            credit_score: 0.75,
            debt_to_income: 0.6,
            employment_stability: 0.8,
            payment_history: 0.9,
            market_volatility: 0.4,
          }
        }),
      });

      const data = await response.json();
      setRiskScore(data);
    } catch (error) {
      console.error('Risk score calculation error:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/risk-management')}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-gray-900">Risk Assessment Agent</h1>
                  <p className="text-sm text-gray-500">AI-powered risk analysis and insights</p>
                </div>
              </div>
            </div>
            
            {/* Risk Score Widget */}
            {riskScore && (
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Risk Score</p>
                      <p className="text-lg font-bold text-gray-900">{riskScore.score}%</p>
                      <p className={`text-xs font-medium ${
                        riskScore.level === 'Low' ? 'text-green-600' :
                        riskScore.level === 'Medium' ? 'text-yellow-600' :
                        riskScore.level === 'High' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {riskScore.level} Risk
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={calculateRiskScore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Calculate Risk
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 ${message.isUser ? 'bg-blue-600' : 'bg-gray-600'} rounded-full p-2`}>
                  {message.isUser ? (
                    <UserIcon className="h-4 w-4 text-white" />
                  ) : (
                    <CpuChipIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}>
                  <div className="whitespace-pre-wrap">
                    {message.isStreaming 
                      ? currentStreamingMessage + (currentStreamingMessage ? '▋' : '🤔 Thinking...')
                      : message.content
                    }
                  </div>
                  <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    <ClockIcon className="inline h-3 w-3 mr-1" />
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about risk assessment, compliance, or get risk analysis..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 