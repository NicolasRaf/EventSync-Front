import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, ScanLine, Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getEvents } from '../../services/eventsService';

export function OrganizerDashboard() {
  const { user } = useContext(AuthContext);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  // Filter events owned by the organizer
  // Note: In a real app, the API should have a specific endpoint for this
  const myEvents = events?.filter(event => event.organizer.email === user?.email) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Painel do Organizador</h1>
          <Link 
            to="/events/new"
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow-lg transition-transform active:scale-95"
          >
            <Plus size={24} />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {myEvents.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Você ainda não criou nenhum evento.</p>
              </div>
            ) : null}

            {myEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.location}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 flex gap-2">
                  <Link 
                    to={`/events/${event.id}/check-in`}
                    className="flex-1 bg-white border border-indigo-200 text-indigo-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                  >
                    <ScanLine size={18} />
                    Check-in
                  </Link>
                  <Link 
                    to={`/events/${event.id}/registrations`}
                    className="flex-1 bg-white border border-gray-200 text-gray-600 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Users size={18} />
                    Inscritos
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
