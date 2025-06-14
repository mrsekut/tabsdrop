import { Storage } from '@plasmohq/storage';
import { RAINDROP_CONFIG } from './config';

const storage = new Storage();

// Raindrop OAuth configuration
const CLIENT_ID = RAINDROP_CONFIG.CLIENT_ID;
const CLIENT_SECRET = RAINDROP_CONFIG.CLIENT_SECRET;
// Use the standard Chrome extension redirect URL
const REDIRECT_URL = chrome.identity.getRedirectURL();

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface StoredToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function authenticateWithRaindrop(): Promise<boolean> {
  try {
    // Check if CLIENT_ID is properly configured
    if (CLIENT_ID === 'YOUR_CLIENT_ID' || !CLIENT_ID) {
      console.error('Raindrop CLIENT_ID is not configured. Please set up your .env.local file.');
      throw new Error('CLIENT_ID not configured');
    }

    // Step 1: Get authorization code
    const authUrl = new URL('https://raindrop.io/oauth/authorize');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URL);
    authUrl.searchParams.append('response_type', 'code');

    const responseUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl.toString(),
          interactive: true,
        },
        responseUrl => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (responseUrl) {
            resolve(responseUrl);
          } else {
            reject(new Error('No response URL'));
          }
        },
      );
    });

    // Step 2: Extract authorization code
    const url = new URL(responseUrl);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      throw new Error(`Authorization error: ${error}`);
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Step 3: Exchange code for access token
    const tokenResponse = await fetch('https://raindrop.io/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
      }),
    });

    const responseText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${responseText}`);
    }

    const tokenData = JSON.parse(responseText);
    
    // Check if Raindrop returned an error in successful HTTP response
    if (!tokenData.result && tokenData.errorMessage) {
      throw new Error(`Raindrop API error: ${tokenData.errorMessage}`);
    }

    // Ensure we have the expected token structure
    if (!tokenData.access_token) {
      throw new Error(`No access token in response: ${responseText}`);
    }

    // Store tokens with expiration
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    await saveTokens({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
    });

    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const storedToken = await getStoredToken();
    if (!storedToken?.refreshToken) {
      return null;
    }

    const response = await fetch('https://raindrop.io/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: storedToken.refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokenData: TokenResponse = await response.json();

    // Update stored tokens
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    await saveTokens({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
    });

    return tokenData.access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const storedToken = await getStoredToken();

  if (!storedToken) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  if (Date.now() > storedToken.expiresAt - 5 * 60 * 1000) {
    return await refreshAccessToken();
  }

  return storedToken.accessToken;
}

async function saveTokens(token: StoredToken): Promise<void> {
  await storage.set('raindropToken', token);
}

async function getStoredToken(): Promise<StoredToken | null> {
  return await storage.get<StoredToken>('raindropToken');
}

export async function logout(): Promise<void> {
  await storage.remove('raindropToken');
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getValidAccessToken();
  return token !== null;
}
