import { useContext } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function Ticket() {
  const { user } = useContext(AuthContext);
  // const { eventId } = useParams();

  // If we don't have user info, we can't generate the valid QR.
  // Ideally, this page is protected so user should be there.
  if (!user) return null;

  return (
    <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-6 relative">
      <Link
        to="/my-registrations"
        className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={28} />
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 w-full max-w-sm">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Seu Ingresso</h1>
          <p className="text-gray-500 text-sm">Escaneie na entrada</p>
        </div>

        <div className="border-4 border-gray-900 p-4 rounded-xl">
          <QRCodeSVG value={user.id} size={200} level="H" />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            ID do Participante
          </p>
          <p className="text-gray-900 font-mono text-lg mt-1">{user.id}</p>
        </div>

        <div className="w-full pt-4 border-t border-gray-100">
           <p className="text-center text-xs text-gray-400">EventSync Ticket System</p>
        </div>
      </div>
    </div>
  );
}
