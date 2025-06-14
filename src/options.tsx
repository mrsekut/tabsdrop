import { useState } from 'react';
import { useRaindropAuth } from '~features/Raindrop/useRaindropAccessToken';
import { authenticateWithRaindrop, logout } from '~features/Raindrop/auth';

export default function Options() {
  const { isAuthenticated, loading, refresh } = useRaindropAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleConnect = async () => {
    setAuthLoading(true);
    setAuthError('');

    const success = await authenticateWithRaindrop();

    if (success) {
      await refresh();
    } else {
      setAuthError('Authentication failed. Please try again.');
    }

    setAuthLoading(false);
  };

  const handleDisconnect = async () => {
    await logout();
    await refresh();
  };

  if (loading) {
    return (
      <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px',
        width: '400px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Raindrop.io Connection Settings</h2>

      {isAuthenticated ? (
        <div>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          >
            <p style={{ margin: 0, color: '#2e7d32' }}>
              ✓ Connected to Raindrop.io
            </p>
          </div>

          <button
            onClick={handleDisconnect}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '16px', color: '#555' }}>
            Connect to Raindrop.io to easily save your open tabs as bookmarks.
          </p>

          <button
            onClick={handleConnect}
            disabled={authLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: authLoading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: authLoading ? 'default' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {authLoading ? 'Connecting...' : 'Connect to Raindrop.io'}
          </button>

          {authError && (
            <p style={{ color: '#f44336', marginTop: '12px' }}>{authError}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '24px', fontSize: '12px', color: '#777' }}>
        <p>Note:</p>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>This extension is not an official Raindrop.io application</li>
          <li>Disconnecting will not delete your saved bookmarks</li>
        </ul>
      </div>
    </div>
  );
}
