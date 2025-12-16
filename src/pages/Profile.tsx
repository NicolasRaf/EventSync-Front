import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Loader2, User as UserIcon, Shield, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile } from '../services/userService';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function Profile() {
  const { signOut } = useContext(AuthContext);

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 gap-4">
              <p className="text-gray-500">Não foi possível carregar o perfil.</p>
              <button onClick={signOut} className="text-red-500 font-bold">Sair</button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
      </div>

      <main className="max-w-md mx-auto px-4 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4 ring-4 ring-white">
            {getInitials(user.name)}
          </div>

          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm mb-4">{user.email}</p>

          {/* Role Badge */}
          <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
             user.role === 'ORGANIZER' 
                ? "bg-purple-100 text-purple-700" 
                : "bg-blue-100 text-blue-700"
          )}>
            {user.role === 'ORGANIZER' ? <Shield size={14} /> : <UserIcon size={14} />}
            {user.role === 'ORGANIZER' ? 'Organizador' : 'Participante'}
          </div>
        </div>

        {/* Menu Options (Placeholder for future) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             {user.role === 'ORGANIZER' && (
                <Link to="/organizer" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium">Painel do Organizador</span>
                     <span className="text-gray-400">→</span>
                </Link>
             )}
            <Link to="/friends" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                   <Users size={20} className="text-gray-500" />
                   <span className="text-gray-700 font-medium">Amigos e Solicitações</span>
                </div>
                 <span className="text-gray-400">→</span>
            </Link>
            <Link to="/my-registrations" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                   <UserIcon size={20} className="text-gray-500" />
                   <span className="text-gray-700 font-medium">Meus Ingressos</span>
                </div>
                 <span className="text-gray-400">→</span>
            </Link>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>

      </main>
    </div>
  );
}
