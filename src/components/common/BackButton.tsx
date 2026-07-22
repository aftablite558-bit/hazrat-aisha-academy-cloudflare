import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GlassButton } from './GlassButton';

export const BackButton = ({ className = '' }: { className?: string }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <GlassButton variant="ghost" className={`!px-4 flex items-center gap-2 w-fit ${className}`} onClick={handleBack}>
      <ArrowLeft size={20} /> Back
    </GlassButton>
  );
};
