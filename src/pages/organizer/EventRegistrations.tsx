import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getEventRegistrations, updateRegistrationStatus } from '../../services/eventsService';
import { FeedbackModal } from '../../components/ui/FeedbackModal';

export function EventRegistrations() {
  const { eventId } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');

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

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['registrations', eventId],
    queryFn: () => getEventRegistrations(eventId!),
    enabled: !!eventId,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) =>
      updateRegistrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
    },
    onError: () => {
      showFeedback('error', 'Erro', 'Erro ao atualizar status da inscrição.');
    }
  });

  const handleStatusUpdate = (id: string, status: 'APPROVED' | 'REJECTED') => {
    mutation.mutate({ id, status });
  };

  // Filter registrations based on active tab
  const pendingRegistrations = registrations?.filter(r => (r.status || 'PENDING') === 'PENDING') || [];
  const confirmedRegistrations = registrations?.filter(r => r.status === 'APPROVED') || [];
  
  const displayedRegistrations = activeTab === 'pending' ? pendingRegistrations : confirmedRegistrations;
  
  // Since we don't have the event title directly from the registration list endpoint easily 
  // (unless nested), we might use the first registration to get event details if available, 
  // or just show a generic title. For now we assume safety.
  const eventTitle = registrations?.[0]?.event?.title || "Evento";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={closeFeedback}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onAction={feedback.onAction}
      />
       <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link to="/organizer" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1 min-w-0">
             <p className="text-xs text-uppercase text-gray-500 font-bold tracking-wider">Gestão de Inscrições</p>
             <h1 className="text-lg font-bold text-gray-900 truncate">{eventTitle}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-200 rounded-xl">
            <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                    activeTab === 'pending' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                Pendentes
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'pending' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-300 text-gray-600'}`}>
                    {pendingRegistrations.length}
                </span>
            </button>
            <button
                onClick={() => setActiveTab('confirmed')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                    activeTab === 'confirmed' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                Confirmados
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'confirmed' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-300 text-gray-600'}`}>
                    {confirmedRegistrations.length}
                </span>
            </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            {displayedRegistrations.length === 0 ? (
              <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                <User className="w-12 h-12 opacity-20 mb-3" />
                <p>Nenhum inscrito {activeTab === 'pending' ? 'pendente' : 'confirmado'}.</p>
              </div>
            ) : null}

            {activeTab === 'pending' && pendingRegistrations.length > 0 && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => {
                            if (window.confirm('Tem certeza que deseja aprovar todas as solicitações pendentes?')) {
                                Promise.all(pendingRegistrations.map(r => updateRegistrationStatus(r.id, 'APPROVED')))
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
                                        showFeedback('success', 'Sucesso', 'Todas as inscrições foram aprovadas!');
                                    })
                                    .catch(() => showFeedback('error', 'Erro', 'Erro ao aprovar todas as inscrições.'));
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-sm"
                    >
                        <CheckCircle size={16} />
                        Aprovar Todos ({pendingRegistrations.length})
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {displayedRegistrations.map((reg) => (
                <div key={reg.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
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
                        <div className="text-xs text-gray-400">
                            <span className="block text-right">Solicitado em:</span>
                            <span className="font-medium text-gray-600">
                                {(reg.date || reg.createdAt) ? new Date(reg.date || reg.createdAt!).toLocaleDateString() : 'Data indisponível'}
                            </span>
                        </div>
                    </div>

                    {activeTab === 'pending' && (
                         <div className="flex gap-3">
                            <button 
                                onClick={() => handleStatusUpdate(reg.id, 'APPROVED')}
                                disabled={mutation.isPending}
                                className="flex-1 h-11 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                Aprovar
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(reg.id, 'REJECTED')}
                                disabled={mutation.isPending}
                                className="flex-1 h-11 bg-red-50 text-red-700 font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                                Recusar
                            </button>
                         </div>
                    )}
                </div>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
