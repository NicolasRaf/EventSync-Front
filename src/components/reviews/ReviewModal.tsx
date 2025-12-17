import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { StarRating } from './StarRating';
import { FeedbackModal } from '../ui/FeedbackModal';
import { createReview } from '../../services/reviewService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export function ReviewModal({ isOpen, onClose, eventId, eventTitle }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Feedback Modal State
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const closeFeedback = () => setFeedback(prev => ({ ...prev, isOpen: false }));

  const showFeedback = (type: 'success' | 'error' | 'info', title: string, message: string, onAction?: () => void) => {
    setFeedback({ isOpen: true, type, title, message, onAction });
  };

  const mutation = useMutation({
    mutationFn: () => createReview(eventId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      showFeedback('success', 'Avaliação Enviada', 'Obrigado pelo seu feedback!', () => {
        onClose();
        setRating(0);
        setComment('');
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error?.response?.data?.message || error.message;
      console.log('Review Error caught:', errorMessage, error.response?.status);
      
      if (error?.response?.status === 400 && errorMessage.includes('User has already reviewed')) {
        queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
        showFeedback('info', 'Já avaliado', 'Você já avaliou este evento. Sua lista será atualizada.', () => {
             onClose();
        });
      } else {
        showFeedback('error', 'Erro', 'Erro ao enviar avaliação. Tente novamente.');
      }
    }
  });

  if (!isOpen) return null;

  return (
    <>
    <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={closeFeedback}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onAction={feedback.onAction}
    />
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-gray-900 truncate pr-4">Avaliar: {eventTitle}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-gray-500">Toque para avaliar</p>
                <div className="p-2">
                   <StarRating rating={rating} onRatingChange={setRating} size={32} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deixe um comentário</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="O que você achou do evento?"
                    rows={4}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                />
            </div>

            <button
                onClick={() => mutation.mutate()}
                disabled={rating === 0 || mutation.isPending}
                className="w-full h-12 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Enviar Avaliação'}
            </button>
        </div>
      </div>
    </div>
    </>
  );
}
