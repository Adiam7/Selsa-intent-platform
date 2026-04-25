'use client';

import { useCallback } from 'react';

export function useAuth() {
  const getToken = useCallback(async () => {
    // In a real app, we'd fetch this from a secure endpoint
    // For now, the token is in an httpOnly cookie which is secure
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
  }, []);

  return { getToken, logout };
}
