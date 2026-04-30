'use client';

import { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface GoogleAuthButtonProps {
  mode: 'login' | 'register';
  onError: (message: string) => void;
}

export function GoogleAuthButton({ mode, onError }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth();
  const router = useRouter();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      onError('Google did not return a credential. Please try again.');
      return;
    }

    setLoading(true);
    onError('');

    try {
      await googleLogin(credential);
      router.push('/dashboard');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loading ? 'pointer-events-none opacity-60' : ''} aria-busy={loading}>
      <div className="[&>div]:w-full [&_iframe]:!w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError('Google authentication failed. Please try again.')}
          text={mode === 'register' ? 'signup_with' : 'continue_with'}
          theme="outline"
          size="large"
          shape="rectangular"
          logo_alignment="left"
          width="100%"
        />
      </div>
      {loading && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Continuing with Google...
        </p>
      )}
    </div>
  );
}
