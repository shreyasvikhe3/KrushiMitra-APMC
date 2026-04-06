import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT_ID = 'dashboard-google-identity-services';

const GoogleAuthButton = ({
  onCredentialResponse,
  disabled = false,
  text = 'continue_with',
  className = '',
}) => {
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      return undefined;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      if (window.google?.accounts?.id) {
        setScriptReady(true);
      } else {
        existingScript.addEventListener('load', () => setScriptReady(true), { once: true });
      }
      return undefined;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);

    return undefined;
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !scriptReady || !buttonRef.current || !window.google?.accounts?.id) {
      return undefined;
    }

    const renderButton = () => {
      if (!buttonRef.current) {
        return;
      }

      buttonRef.current.innerHTML = '';

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: onCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline',
        size: 'large',
        shape: 'pill',
        text,
        width: Math.min(wrapperRef.current?.offsetWidth || 320, 360),
      });
    };

    renderButton();
    window.addEventListener('resize', renderButton);
    const observer = new MutationObserver(renderButton);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      window.removeEventListener('resize', renderButton);
      observer.disconnect();
    };
  }, [clientId, onCredentialResponse, scriptReady, text]);

  if (!clientId) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 ${className}`}
      >
        Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google sign-in.
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`rounded-2xl border border-slate-200/80 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/50 ${className}`}
    >
      {disabled ? (
        <div className="flex min-h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">
          Google sign-in is temporarily disabled
        </div>
      ) : (
        <div ref={buttonRef} className="flex min-h-11 items-center justify-center" />
      )}
    </div>
  );
};

export default GoogleAuthButton;
