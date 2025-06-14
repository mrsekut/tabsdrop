// Raindrop OAuth Configuration for public distribution
// This app is managed by the extension developer
// Users don't need to create their own Raindrop apps

export const RAINDROP_CONFIG = {
  CLIENT_ID:
    process.env.PLASMO_PUBLIC_RAINDROP_CLIENT_ID || 'YOUR_PRODUCTION_CLIENT_ID',
  CLIENT_SECRET:
    process.env.PLASMO_PUBLIC_RAINDROP_CLIENT_SECRET ||
    'YOUR_PRODUCTION_CLIENT_SECRET',
};
