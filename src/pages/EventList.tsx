import { useContext } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, User, LogOut, Calendar, Ticket } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEvents, subscribeToEvent } from '../services/eventsService';

export function EventList() {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeToEvent,
    onSuccess: (_, eventId) => {
      alert('Inscrição realizada com sucesso!');
      navigate(`/ticket/${eventId}`);
    },
    onError: (error: any) => {
      if (error?.response?.status === 409 || error?.message?.includes('registered')) {
        alert('Você já está inscrito neste evento.');
      } else {
        alert('Erro ao realizar inscrição. Tente novamente.');
      }
    },
  });

  const handleSubscribe = (eventId: string) => {
    subscribeMutation.mutate(eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Eventos</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/my-registrations"
              className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
              title="Meus Ingressos"
            >
              <Ticket size={24} />
            </Link>
            <button
              onClick={signOut}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Carregando eventos...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
            <p>Não foi possível carregar os eventos.</p>
            <p className="text-sm mt-1">Tente novamente mais tarde.</p>
          </div>
        )}

        {!isLoading && !isError && events?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>Nenhum evento encontrado.</p>
          </div>
        )}

        {!isLoading && !isError && events?.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="p-5 space-y-3">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {event.title}
              </h2>

              <p className="text-gray-600 text-sm line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>{event.organizer.name}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleSubscribe(event.id)}
                  disabled={subscribeMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors active:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  {subscribeMutation.isPending ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Inscrever-se'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
