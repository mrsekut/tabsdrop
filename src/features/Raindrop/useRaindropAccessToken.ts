import { useEffect, useState } from 'react';
import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';
import { getValidAccessToken, isAuthenticated } from './auth';

const storage = new Storage();

export const useRaindropAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    const authenticated = await isAuthenticated();
    setIsAuth(authenticated);
    setLoading(false);
  };

  return { isAuthenticated: isAuth, loading, refresh: checkAuthStatus };
};

// Keep for backward compatibility, but now returns valid token
export const useRaindropAccessToken = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    getValidAccessToken().then(token => {
      if (token) setAccessToken(token);
    });
  }, []);

  return { accessToken, setAccessToken: () => {} };
};
