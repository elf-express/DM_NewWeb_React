'use client';

import { logtoConfig } from './logto';
import { signIn as logtoSignIn, signOut as logtoSignOut } from '@logto/next/server-actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        // You might want to add an API route to verify the session
        // const response = await fetch('/api/auth/me');
        // const data = await response.json();
        // setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking auth status', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async () => {
    try {
      await logtoSignIn(logtoConfig);
      router.refresh();
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  const signOut = async () => {
    try {
      await logtoSignOut(logtoConfig);
      setIsAuthenticated(false);
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth();

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        {isLoading ? (
          <div className="px-4 py-2">Loading...</div>
        ) : isAuthenticated ? (
          <SignOut onSignOut={signOut} />
        ) : (
          <SignIn onSignIn={signIn} />
        )}
      </div>
      {children}
    </div>
  );
}
