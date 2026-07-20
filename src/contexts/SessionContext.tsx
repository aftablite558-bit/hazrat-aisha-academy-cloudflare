import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCollection } from '../services/masterDataService';

interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Archived';
}

interface SessionContextType {
  activeSession: AcademicSession | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({ activeSession: null, loading: true });

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<AcademicSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const sessions = await getCollection<AcademicSession>('academic_sessions');
        const active = sessions.find(s => s.status === 'Active') || null;
        setActiveSession(active);
      } catch (error) {
        console.error('Failed to fetch active session', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveSession();
  }, []);

  return (
    <SessionContext.Provider value={{ activeSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
