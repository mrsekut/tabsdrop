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
      認証状況を確認中...
    </div>
  );
}

function NotAuthorized() {
  return (
    <div style={{ padding: '16px', fontSize: '14px', color: '#555' }}>
      Raindrop authentication information is not set. Please configure it on the
      options page.
    </div>
  );
}
