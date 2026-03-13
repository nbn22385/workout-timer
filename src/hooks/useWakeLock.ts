import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock(enabled: boolean) {
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const isSupported = 'wakeLock' in navigator;

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Wake Lock API not supported');
    }
    
    try {
      // Release existing wake lock if any
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch (e) {
          // Ignore release errors
        }
      }
      
      const wakeLock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = wakeLock;
      setIsActive(true);
      
      wakeLock.addEventListener('release', () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });
    } catch (err) {
      console.error('Wake lock error:', err);
      setIsActive(false);
      throw err;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (e) {
        // Ignore release errors
      }
      wakeLockRef.current = null;
    }
    setIsActive(false);
  }, []);

  // Handle visibility changes - re-request wake lock when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && enabled && wakeLockRef.current) {
        // Re-request wake lock if we lost it
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, requestWakeLock]);

  return { isActive, isSupported, requestWakeLock, releaseWakeLock };
}
