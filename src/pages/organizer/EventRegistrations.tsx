import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { getEventRegistrations } from '../../services/eventsService';

export function EventRegistrations() {
  const { eventId } = useParams();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => getEventRegistrations(eventId!),
    enabled: !!eventId,
  });

  // Since we don't have the event title directly from the registration list endpoint easily 
  // (unless nested), we might use the first registration to get event details if available, 
  // or just show a generic title. For now we assume safety.
  const eventTitle = registrations?.[0]?.event?.title || "Evento";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link to="/organizer" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
             <p className="text-xs text-uppercase text-gray-500 font-bold tracking-wider">Inscritos</p>
             <h1 className="text-lg font-bold text-gray-900 truncate">{eventTitle}</h1>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
            {registrations?.length || 0}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {registrations?.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Nenhum inscrito ainda.</p>
              </div>
            ) : null}

            {registrations?.map((reg) => (
              <div key={reg.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-500">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {reg.user?.name || "Participante Desconhecido"}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
                     <Mail size={12} />
                     {reg.user?.email || "Email não disponível"}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex flex-col items-end">
                   <span>Inscrito em:</span>
                   <span className="font-medium text-gray-600">
                     {new Date(reg.date).toLocaleDateString()}
                   </span>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
