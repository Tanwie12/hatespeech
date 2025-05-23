export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
export const PRODUCTION_API_URL = 'https://backend-hatespeech.onrender.com';

export const getApiUrl = () => {
  // Check if we're in a production environment or if online mode is enabled
  const isOnlineMode = process.env.NEXT_PUBLIC_ONLINE_MODE === 'true';
  return isOnlineMode ? PRODUCTION_API_URL : API_URL;
}; 