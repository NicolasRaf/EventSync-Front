import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function OrganizerRoute({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);

  if (user?.role !== 'ORGANIZER') {
    return <Navigate to="/events" replace />;
  }

  return children;
}
