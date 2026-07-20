import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmDialogProps) => {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 rounded-full bg-danger-500/20 text-danger-500 flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        <p className="text-foreground mb-8">{message}</p>
        <div className="flex gap-4 w-full justify-center">
          <GlassButton variant="ghost" onClick={onClose} className="w-32">{cancelText}</GlassButton>
          <GlassButton variant="primary" onClick={() => { onConfirm(); onClose(); }} className="w-32 bg-danger-500 border-danger-500 hover:shadow-danger-500/50">{confirmText}</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
