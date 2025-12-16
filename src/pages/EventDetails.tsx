import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, Ticket, Loader2, UserPlus, Check } from 'lucide-react';
import { useContext, useState } from 'react';
import { getEventDetails, subscribeToEvent, getMyRegistrations } from '../services/eventsService';
import { sendFriendRequest } from '../services/socialService';
import { AuthContext } from '../context/AuthContext';

function formatEventDate(dateString: string): string {
  if (!dateString) return 'Data a definir';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data a definir';

  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function EventDetails() {
  const { eventId } = useParams();
  const { user } = useContext(AuthContext);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  // Fetch Event Details
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventDetails(eventId!),
    enabled: !!eventId,
  });

  // Fetch User Registrations to check if already registered
  const { data: myRegistrations } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: getMyRegistrations,
  });

  const isRegistered = myRegistrations?.some((reg) => reg.event.id === eventId);

  const subscribeMutation = useMutation({
    mutationFn: subscribeToEvent,
    onSuccess: () => {
      window.location.href = `/ticket/${eventId}`;
    },
    onError: (error: any) => {
      if (error?.response?.status === 409 || error?.message?.includes('registered')) {
        alert('Você já está inscrito neste evento.');
      } else {
        alert('Erro ao realizar inscrição.');
      }
    },
  });

  const friendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_, userId) => {
        setSentRequests(prev => new Set(prev).add(userId));
    },
    onError: (error: any) => {
        console.error(error);
        const message = error.response?.data?.message || "Erro ao enviar solicitação.";
        alert(message);
    }
  });

  const handleFriendRequest = (userId: string) => {
      if (sentRequests.has(userId)) return;
      friendRequestMutation.mutate(userId);
  }

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Evento não encontrado.</p>
        <Link to="/events" className="text-indigo-600 font-bold">
          Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Hero Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="gap-3 max-w-md mx-auto flex items-center">
          <Link to="/events" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 truncate flex-1">{event.title}</h1>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        {/* Main Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {event.title}
            </h1>
            <p className="text-gray-500 text-sm">
              Organizado por {event.organizer?.name || 'Organizador não identificado'}
            </p>
          </div>

          <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                  Data e Hora
                </p>
                <p className="font-medium">{formatEventDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Local</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 text-lg">Sobre o evento</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Social - Participants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              Quem vai
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {event.participants?.length || 0}
              </span>
            </h3>
          </div>

          {!event.participants || event.participants.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Seja o primeiro a se inscrever!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {event.participants.map((part) => {
                  const isMe = part.id === user?.id; // Assuming user available from context
                  const isFriendRequestSent = sentRequests.has(part.id);

                  return (
                    <div
                        key={part.id}
                        className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">
                            {getInitials(part.name)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{part.name}</p>
                            {isMe && <span className="text-xs text-gray-400">(Você)</span>}
                        </div>
                        </div>

                        {/* Add Friend Button - Only if registered and not me */}
                        {isRegistered && !isMe && (
                           <button
                             onClick={() => handleFriendRequest(part.id)}
                             disabled={isFriendRequestSent || friendRequestMutation.isPending}
                             className={`p-2 rounded-full transition-colors ${
                                 isFriendRequestSent 
                                 ? 'bg-green-100 text-green-600' 
                                 : 'bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600'
                             }`}
                             title={isFriendRequestSent ? "Solicitação enviada" : "Adicionar amigo"}
                           >
                               {isFriendRequestSent ? <Check size={18} /> : <UserPlus size={18} />}
                           </button>
                        )}
                    </div>
                  );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-md mx-auto">
          {isRegistered ? (
            <Link
              to={`/ticket/${eventId}`}
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Ticket size={20} />
              Ver Meu Ingresso
            </Link>
          ) : (
            <button
              onClick={() => subscribeMutation.mutate(eventId!)}
              disabled={subscribeMutation.isPending}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {subscribeMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Inscrever-se Agora'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
