import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningMessage?: string;
  icon: ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  warningMessage,
  icon,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmButtonColor = 'destructive'
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            {icon}
          </div>
          <DialogTitle className="text-lg font-medium text-gray-900 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {message}
          </DialogDescription>
          {warningMessage && (
            <p className="text-xs text-gray-400">
              {warningMessage}
            </p>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonColor}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
