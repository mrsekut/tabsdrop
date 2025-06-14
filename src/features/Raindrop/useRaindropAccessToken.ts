import { useEffect, useState } from 'react';
import { isAuthenticated } from './auth';

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
