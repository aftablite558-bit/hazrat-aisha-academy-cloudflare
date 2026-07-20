import { GlassCard } from "../../components/common/GlassCard";
import { Link } from 'react-router-dom';
import { GlassButton } from '../../components/common/GlassButton';

export const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 px-4">
    <GlassCard className="p-10 max-w-md w-full text-center">
      <h1 className="text-6xl font-extrabold text-primary-500 mb-4">403</h1>
      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
      <p className="text-muted-foreground mb-8">You do not have permission to access this page.</p>
      <Link to="/">
        <GlassButton variant="primary" className="w-full">Return Home</GlassButton>
      </Link>
    </GlassCard>
  </div>
);
