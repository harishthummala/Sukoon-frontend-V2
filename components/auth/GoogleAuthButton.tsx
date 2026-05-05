'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface GoogleAuthButtonProps {
  mode: 'login' | 'register';
  onError: (message: string) => void;
}

export function GoogleAuthButton({ mode, onError }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { googleAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const measuredWidth = Math.floor(container.getBoundingClientRect().width);
      if (measuredWidth < 200) return;

      const nextWidth = Math.min(measuredWidth, 400);
      setButtonWidth((currentWidth) => (
        currentWidth === nextWidth ? currentWidth : nextWidth
      ));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      onError('Google did not return a credential. Please try again.');
      return;
    }

    setLoading(true);
    onError('');

    try {
      await googleAuth(credential, mode);
      router.push('/dashboard');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loading ? 'pointer-events-none opacity-60' : ''} aria-busy={loading}>
      <div ref={containerRef} className="[&>div]:w-full [&_iframe]:!w-full min-h-10">
        {buttonWidth ? (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => onError('Google authentication failed. Please try again.')}
            text={mode === 'register' ? 'signup_with' : 'signin_with'}
            theme="outline"
            size="large"
            shape="rectangular"
            logo_alignment="left"
            width={String(buttonWidth)}
          />
        ) : (
          <div className="h-10 w-full rounded border border-border bg-muted/30" />
        )}
      </div>
      {loading && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === 'register' ? 'Signing up with Google...' : 'Signing in with Google...'}
        </p>
      )}
    </div>
  );
}
