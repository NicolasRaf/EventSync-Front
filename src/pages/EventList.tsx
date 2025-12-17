import { useState, useContext, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MapPin, User, LogOut, Calendar, Search, Video } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEvents, subscribeToEvent } from '../services/eventsService';
import { cn } from '../lib/utils';

export function EventList() {
  const { signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ONLINE' | 'IN_PERSON'>('ALL');

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(event => {
      // 1. Filter by Search Term (Title or Description or Location)
      const term = searchTerm.toLowerCase();
      const title = event.title?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      const location = event.location?.toLowerCase() || '';

      const matchesSearch = 
        searchTerm === '' ||
        title.includes(term) ||
        description.includes(term) ||
        location.includes(term);
      
      // 2. Filter by Category
      let matchesCategory = true;
      if (selectedCategory === 'ONLINE') {
        matchesCategory = event.locationType === 'ONLINE' || location.includes('online');
      } else if (selectedCategory === 'IN_PERSON') {
        matchesCategory = event.locationType === 'IN_PERSON' || (event.locationType !== 'ONLINE' && !location.includes('online'));
      }

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  const subscribeMutation = useMutation({
    mutationFn: subscribeToEvent,
    onSuccess: (_, eventId) => {
      alert('Inscrição realizada com sucesso!');
      navigate(`/ticket/${eventId}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error?.response?.status === 409 || error?.message?.includes('registered') || error?.response?.data?.message?.includes('User already registered')) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header - Simplified for Feed, Actions moved to BottomMenu */}
      <header className="bg-white sticky top-0 z-20 shadow-sm transition-all">
         {/* Hero Section */}
         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 pt-8 pb-12 rounded-b-3xl mb-[-24px]">
             <div className="max-w-md mx-auto flex justify-between items-start">
                  <div>
                      <h1 className="text-2xl font-extrabold text-white leading-tight">
                        Descubra <br/>experiências incríveis
                      </h1>
                      <p className="text-indigo-100 text-sm mt-1">Encontre seu próximo evento favorito</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                  >
                     <LogOut size={20} />
                  </button>
             </div>
         </div>

         {/* Toolbar Section (Overlapping Hero) */}
         <div className="max-w-md mx-auto px-4 -mt-6">
             <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4 border border-gray-100">
                  {/* Search Bar */}
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                          type="text"
                          placeholder="Buscar por nome, local..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400"
                      />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:no-scrollbar">
                      <button 
                        onClick={() => setSelectedCategory('ALL')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                            selectedCategory === 'ALL'
                             ? "bg-indigo-600 text-white border-indigo-600"
                             : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                          Todos
                      </button>
                       <button 
                        onClick={() => setSelectedCategory('ONLINE')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                            selectedCategory === 'ONLINE'
                             ? "bg-indigo-600 text-white border-indigo-600"
                             : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                          Online
                      </button>
                       <button 
                        onClick={() => setSelectedCategory('IN_PERSON')}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                            selectedCategory === 'IN_PERSON'
                             ? "bg-indigo-600 text-white border-indigo-600"
                             : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                          Presencial
                      </button>
                  </div>
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

        {/* Results Info */}
        {!isLoading && !isError && (
             <div className="flex items-center justify-between px-2 pt-2 pb-0">
                  <h2 className="font-bold text-gray-800 text-lg">Próximos Eventos</h2>
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                      {filteredEvents.length} encontrados
                  </span>
             </div>
        )}

        {!isLoading && !isError && filteredEvents.length === 0 && (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center">
             <div className="bg-gray-100 p-4 rounded-full mb-3">
                 <Search size={32} className="text-gray-400" />
             </div>
             <p className="font-medium text-gray-600">Nenhum evento encontrado.</p>
             <p className="text-sm mt-1">Tente mudar seus filtros ou busca.</p>
          </div>
        )}

        {!isLoading && !isError && filteredEvents.map((event) => {
          const isRegistered = event.participants?.some(p => p.id === user?.id);
          const isOwner = user?.id === event.organizerId;
          
          console.log(`Event Debug: ${event.title}`, { 
             location: event.location, 
             locationType: event.locationType 
          });

          return (
          <Link
            to={`/events/${event.id}`}
            key={event.id}
            className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    {event.title}
                </h2>
                {event.locationType === 'ONLINE' && (
                     <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shrink-0">
                         <Video size={10} /> Online
                     </span>
                )}
                {event.locationType === 'IN_PERSON' && (
                     <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shrink-0">
                         <MapPin size={10} /> Presencial
                     </span>
                )}
              </div>

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
                  {event.locationType === 'ONLINE' ? (
                     <>
                        <Video className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{event.location}</span>
                     </>
                  ) : (
                     <>
                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{event.location}</span>
                     </>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>{event.organizer.name}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={(e) => {
                      e.preventDefault(); // Prevent navigating to details
                      if (isOwner) {
                          navigate(`/events/${event.id}/registrations`);
                          return;
                      }
                      if (!isRegistered) {
                        handleSubscribe(event.id);
                      }
                  }}
                  disabled={subscribeMutation.isPending || isRegistered}
                  className={cn(
                    "w-full font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center",
                    (isRegistered)
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : isOwner
                      ? "bg-white border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white active:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed"
                  )}
                >
                  {subscribeMutation.isPending ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isOwner ? (
                    'Gerenciar Evento'
                  ) : isRegistered ? (
                    'Inscrito'
                  ) : (
                    'Inscrever-se'
                  )}
                </button>
              </div>
            </div>
          </Link>
           );
        })}
      </main>
    </div>
  );
}
