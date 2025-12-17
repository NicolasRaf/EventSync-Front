import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '../../services/socialService';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendId: string;
  friendName: string;
}

export function SendMessageModal({ isOpen, onClose, friendId, friendName }: SendMessageModalProps) {
  const [message, setMessage] = useState('');

  const mutation = useMutation({
    mutationFn: () => sendMessage(friendId, message),
    onSuccess: () => {
      alert('Mensagem enviada com sucesso!');
      setMessage('');
      onClose();
    },
    onError: () => {
      alert('Erro ao enviar mensagem.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    mutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Panel */}
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold leading-6 text-gray-900">
                    Nova Mensagem para {friendName}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-32 p-3 text-sm text-gray-700 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none focus:outline-none"
                      placeholder="Digite sua mensagem..."
                      maxLength={500}
                      autoFocus
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {message.length}/500
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={!message.trim() || mutation.isPending}
                      className="inline-flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                    >
                      {mutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
            </div>
        </div>
    </div>
  );
}
