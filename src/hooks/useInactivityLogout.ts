import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes
const WARNING_TIME = 1 * 60 * 1000; // 1 minute warning

export const useInactivityLogout = () => {
  const { user, logoutUser } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const warningTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    setShowWarning(false);

    if (user) {
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
      }, INACTIVITY_TIME - WARNING_TIME);

      timerRef.current = setTimeout(() => {
        logoutUser();
      }, INACTIVITY_TIME);
    }
  }, [user, logoutUser]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [resetTimer]);

  return { showWarning, setShowWarning, resetTimer };
};
