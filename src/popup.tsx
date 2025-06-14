import { useState, useEffect } from 'react';
import { isAuthenticated } from './features/Raindrop/auth';
import { TabSaver } from './TabSaver';

export default function Popup() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!isAuth) {
    return <NotAuthorized />;
  }

  return <TabSaver />;
}

function Loading() {
  return (
    <div style={{ padding: '16px', fontSize: '14px', color: '#555' }}>
      Checking authentication status...
    </div>
  );
}

function NotAuthorized() {
  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div style={{ padding: '16px', width: '280px' }}>
      <div style={{ marginBottom: '12px', fontSize: '14px', color: '#555' }}>
        Raindrop.io connection required
      </div>

      <button
        onClick={openOptionsPage}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        Open Settings
      </button>

      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
        Click "Connect to Raindrop.io" in the settings page
      </div>
    </div>
  );
}
