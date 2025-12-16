import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Calendar, MapPin, AlignLeft, Type } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '../../services/eventsService';
import { cn } from '../../lib/utils';
import axios from 'axios';

const createEventSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  date: z.string().min(1, 'Data e hora são obrigatórias'),
  location: z.string().min(3, 'O local deve ter pelo menos 3 caracteres'),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

export function CreateEvent() {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
  });

  async function handleCreateEvent(data: CreateEventFormData) {
    setRequestError(null);
    try {
      // Ensure date is ISO format if needed, but simple string usually works if backend parses it
      // Standardize to ISO string for safety
      const dateObj = new Date(data.date);
      const isoDate = dateObj.toISOString();

      await createEvent({
        ...data,
        date: isoDate,
      });

      alert('Evento criado com sucesso!');
      navigate('/organizer');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setRequestError(error.response.data.message || 'Erro ao criar evento.');
      } else {
        setRequestError('Erro inesperado. Tente novamente.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link to="/organizer" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Novo Evento</h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4">
        <form onSubmit={handleSubmit(handleCreateEvent)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type size={16} /> Título do Evento
            </label>
            <input
              type="text"
              className={cn(
                "w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                errors.title && "border-red-500 ring-red-500"
              )}
              placeholder="Ex: Workshop de React"
              {...register('title')}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlignLeft size={16} /> Descrição
            </label>
            <textarea
              className={cn(
                "w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]",
                errors.description && "border-red-500 ring-red-500"
              )}
              placeholder="Detalhes sobre o evento..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar size={16} /> Data e Hora
            </label>
            <input
              type="datetime-local"
              className={cn(
                "w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                errors.date && "border-red-500 ring-red-500"
              )}
              {...register('date')}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> Localização
            </label>
            <input
              type="text"
              className={cn(
                "w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
                errors.location && "border-red-500 ring-red-500"
              )}
              placeholder="Ex: Auditório Principal"
              {...register('location')}
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>

          {requestError && (
             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
               {requestError}
             </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Criar Evento'}
          </button>
        </form>
      </main>
    </div>
  );
}
