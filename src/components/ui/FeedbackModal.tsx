import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

export type FeedbackType = 'success' | 'error' | 'info';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: FeedbackType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function FeedbackModal({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  actionLabel = 'Ok',
  onAction,
}: FeedbackModalProps) {
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
  };



  const buttonColors = {
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className={cn("p-3 rounded-full bg-opacity-20", 
              type === 'success' ? 'bg-green-100' : 
              type === 'error' ? 'bg-red-100' : 'bg-blue-100'
          )}>
            {icons[type]}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
          </div>

          <button
            onClick={() => {
              onAction?.();
              onClose();
            }}
            className={cn(
              "w-full py-3 px-4 rounded-xl text-white font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
              buttonColors[type]
            )}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
