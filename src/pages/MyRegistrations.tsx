import { useQuery } from '@tanstack/react-query';
import { Calendar, Ticket, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyRegistrations } from '../services/eventsService';

export function MyRegistrations() {
  const { data: registrations, isLoading, isError } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: getMyRegistrations,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/events" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Meus Ingressos</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Carregando seus ingressos...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
            <p>Erro ao carregar ingressos.</p>
          </div>
        )}

        {!isLoading && !isError && registrations?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-gray-500">
            <Ticket size={48} className="text-gray-300" />
            <p className="text-lg font-medium">Você ainda não tem ingressos.</p>
            <Link
              to="/events"
              className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              <Search size={20} />
              Explorar Eventos
            </Link>
          </div>
        )}

        {!isLoading && !isError && registrations?.map((reg) => (
          <div
            key={reg.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 flex flex-row gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-gray-900 leading-tight">
                  {reg.event.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1.5 text-indigo-500" />
                  <span>
                    {new Date(reg.event.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <Link
                  to={`/ticket/${reg.event.id}`}
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-3 rounded-lg transition-colors flex flex-col items-center gap-1 min-w-[80px]"
                >
                  <Ticket size={24} />
                  <span className="text-xs font-bold">QR Code</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
