// Configuration for backend URLs
export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 
             (typeof window !== 'undefined' && window.location.hostname === 'localhost') 
               ? 'http://localhost:5001'
               : 'https://33fa-216-165-95-189.ngrok-free.app',
  
  // API endpoints
  endpoints: {
    chat: '/chat',
    riskScore: '/risk-score',
    analyzeRisk: '/analyze-risk',
    health: '/health'
  }
}

// Helper function to get full URL
export const getApiUrl = (endpoint: string) => {
  const baseUrl = config.backendUrl;
  console.log('Using backend URL:', baseUrl);
  return `${baseUrl}${endpoint}`;
}; 