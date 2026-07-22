import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import { AppRoutes } from './routes/AppRoutes';
import { SetupGuard } from './components/auth/SetupGuard';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SessionProvider>
          <ToastProvider>
            <AuthProvider>
              <SetupGuard>
                <AppRoutes />
              </SetupGuard>
            </AuthProvider>
          </ToastProvider>
        </SessionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
