import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users, MessageCircle, Check, X, Loader2, Mail, Clock } from 'lucide-react';
import { getFriends, getFriendRequests, respondToFriendRequest, getMyMessages } from '../services/socialService';

import { SendMessageModal } from '../components/social/SendMessageModal';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function Friends() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'messages'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<{ id: string; name: string } | null>(null);

  // Queries
  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['my-messages'],
    queryFn: getMyMessages,
  });

  // Mutations
  const respondMutation = useMutation({
    mutationFn: ({ requestId, accept }: { requestId: string; accept: boolean }) =>
      respondToFriendRequest(requestId, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: () => {
        alert("Erro ao processar solicitação.");
    }
  });

  const handleRespond = (requestId: string, accept: boolean) => {
    respondMutation.mutate({ requestId, accept });
  };

  const handleMessage = (friend: { id: string; name: string }) => {
      setSelectedFriend(friend);
  }

  const isLoading = isLoadingFriends || isLoadingRequests || isLoadingMessages;
  const requestsCount = requests?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="gap-3 max-w-md mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate flex-1">Amigos & Recados</h1>
        </div>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-200 rounded-xl overflow-x-auto no-scrollbar">
            <button
                onClick={() => setActiveTab('friends')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'friends' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Users size={18} />
                Amigos
            </button>
            <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 text-sm font-bold rounded-lg transition-colors relative whitespace-nowrap ${
                    activeTab === 'requests' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <UserPlus size={18} />
                Solicit.
                {requestsCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>
            <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'messages' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Mail size={18} />
                Recados
            </button>
        </div>

        {/* Content */}
        {isLoading ? (
             <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        ) : (
            <div className="space-y-4">
                {activeTab === 'friends' && (
                    // Friends List
                    friends?.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Você ainda não tem amigos.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {friends?.map(friend => (
                                <div key={friend.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {getInitials(friend.name)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{friend.name}</p>
                                            <p className="text-xs text-gray-500">{friend.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleMessage({ id: friend.id, name: friend.name })}
                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <MessageCircle size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'requests' && (
                    // Requests List
                    requests?.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                             <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Nenhuma solicitação pendente.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                             {requests?.map(request => (
                                <div key={request.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                                            {getInitials(request.sender.name)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{request.sender.name}</p>
                                            <p className="text-xs text-gray-500">Enviada em {new Date(request.createdAt).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleRespond(request.id, true)}
                                            disabled={respondMutation.isPending}
                                            className="flex-1 h-11 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {respondMutation.isPending ? <Loader2 className="animate-spin" /> : <Check size={18} />}
                                            Aceitar
                                        </button>
                                        <button 
                                            onClick={() => handleRespond(request.id, false)}
                                            disabled={respondMutation.isPending}
                                            className="flex-1 h-11 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                             {respondMutation.isPending ? <Loader2 className="animate-spin" /> : <X size={18} />}
                                            Recusar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'messages' && (
                  // Messages List
                  messages?.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Nenhum recado recebido.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map(message => (
                        <div key={message.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {getInitials(message.sender.name)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{message.sender.name}</p>
                                <p className="text-xs text-gray-500">{message.sender.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={12} />
                                {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
            </div>
        )}
      </main>

      {/* Modals */}
      {selectedFriend && (
        <SendMessageModal
          isOpen={true}
          onClose={() => setSelectedFriend(null)}
          friendId={selectedFriend.id}
          friendName={selectedFriend.name}
        />
      )}
    </div>
  );
}
