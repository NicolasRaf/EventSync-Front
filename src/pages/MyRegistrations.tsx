import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Ticket, ArrowLeft, Search, CheckCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyRegistrations, cancelRegistration } from '../services/eventsService';
import { ReviewModal } from '../components/reviews/ReviewModal';


export function MyRegistrations() {

  const queryClient = useQueryClient();
  /* New state for review modal */
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEventForReview, setSelectedEventForReview] = useState<{id: string, title: string} | null>(null);

  const handleOpenReview = (event: {id: string, title: string}) => {
    setSelectedEventForReview(event);
    setReviewModalOpen(true);
  };

  const { data: registrations, isLoading, isError } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: getMyRegistrations,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      alert('Inscrição cancelada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao cancelar inscrição:', error);
      alert('Não foi possível cancelar a inscrição. Tente novamente.');
    }
  });

  const handleCancel = async (registrationId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar sua inscrição neste evento?')) {
        cancelMutation.mutate(registrationId);
    }
  };




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

                {/* Status Badge */}
                <div className="mt-2">
                  {reg.status === 'PENDING' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Aguardando Aprovação
                    </span>
                  )}
                  {reg.status === 'APPROVED' && !reg.checkedInAt && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Confirmado / Aguardando Check-in
                    </span>
                  )}
                  {!!reg.checkedInAt && (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                        <CheckCheck size={12} />
                        Check-in Realizado
                     </span>
                  )}
                  {reg.status === 'REJECTED' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inscrição Recusada
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                    {/* Avaliar Button - Strictly only if checked-in */}
                    {!!reg.checkedInAt && (!reg.event.reviews || reg.event.reviews.length === 0) && (
                        <button
                            onClick={() => handleOpenReview(reg.event)}
                            className="text-sm font-bold text-yellow-600 border border-yellow-400 rounded-lg px-3 py-1.5 hover:bg-yellow-50 transition-colors flex items-center justify-center w-fit"
                        >
                            Avaliar Evento
                        </button>
                    )}
                    {!!reg.checkedInAt && (reg.event.reviews && reg.event.reviews.length > 0) && (
                         <span className="text-sm font-medium text-green-600 border border-green-200 bg-green-50 rounded-lg px-3 py-1.5 flex items-center justify-center w-fit cursor-default">
                             Avaliado
                         </span>
                    )}

                     {/* Cancel Button - Only for Pending or Approved/Confirmed (not checked-in yet, assuming) */}
                     {/* User request: "Em cada card de inscrição...". Usually strict logic needed, but let's default to allowing cancel for Active (Pending/Approved) */}
                     {/* Logic: Can cancel if NOT checked-in and NOT rejected? Or simple trash icon always? */}
                     {/* Let's follow "Em cada card". But logically makes sense only for future events. */}
                     {/* Assuming we can cancel unless rejected/past */}
                     {(reg.status === 'PENDING' || reg.status === 'APPROVED') && !reg.checkedInAt && (
                         <button
                            onClick={() => handleCancel(reg.id)}
                            className="text-sm font-bold text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 hover:text-red-800 transition-colors flex items-center justify-center gap-1 w-fit"
                            title="Cancelar Inscrição"
                            disabled={cancelMutation.isPending}
                         >
                            <Trash2 size={16} />
                            {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar'}
                         </button>
                     )}
                </div>
              </div>

              {/* Show Ticket Button for Approved/CheckedIn */}
              {(reg.status === 'APPROVED' || !!reg.checkedInAt) && (
                  <div className="flex flex-col justify-center">
                    <Link
                      to={`/ticket/${reg.event.id}`}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-3 rounded-lg transition-colors flex flex-col items-center gap-1 min-w-[80px]"
                    >
                      <Ticket size={24} />
                      <span className="text-xs font-bold">QR Code</span>
                    </Link>
                  </div>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Review Modal */}
      {selectedEventForReview && (
        <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            eventId={selectedEventForReview.id}
            eventTitle={selectedEventForReview.title}
        />
      )}
    </div>
  );
}
