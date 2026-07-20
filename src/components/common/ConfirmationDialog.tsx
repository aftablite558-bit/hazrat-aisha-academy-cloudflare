import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmationDialogProps) => {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <p className="text-foreground mb-8">{message}</p>
        <div className="flex justify-end gap-4">
          <GlassButton variant="ghost" onClick={onClose}>{cancelText}</GlassButton>
          <GlassButton variant="primary" onClick={() => { onConfirm(); onClose(); }} className="!bg-danger-500 !border-danger-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.15),0_0_30px_rgba(239,68,68,0.6)]">{confirmText}</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
