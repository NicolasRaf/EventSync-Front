import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, User, FolderCog } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export function BottomMenu() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {/* Home (Feed) - Available for everyone */}
      <Link
        to="/events"
        className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          isActive('/events') ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
        )}
      >
        <Home size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      {/* Organizer Dashboard - Only for Organizers */}
      {user.role === 'ORGANIZER' && (
        <Link
          to="/organizer"
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
            isActive('/organizer') ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <FolderCog size={24} />
          <span className="text-[10px] font-medium">Painel</span>
        </Link>
      )}

      {/* My Tickets - Available for EVERYONE (Organizers are also participants) */}
      <Link
        to="/my-registrations"
        className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          isActive('/my-registrations') ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
        )}
      >
        <Ticket size={24} />
        <span className="text-[10px] font-medium">Ingressos</span>
      </Link>

      {/* Profile/Menu - For now just empty or logout link context */}
      {/* Profile */}
      <Link
        to="/profile"
        className={cn(
          "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
          isActive('/profile') ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
        )}
      >
        <User size={24} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>
    </nav>
  );
}
