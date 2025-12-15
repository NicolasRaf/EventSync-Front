import { createBrowserRouter } from 'react-router-dom';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { EventList } from '../pages/EventList';
import { MyRegistrations } from '../pages/MyRegistrations';
import { Ticket } from '../pages/Ticket';
import { PrivateRoute } from './PrivateRoute';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '/register',
    element: <SignUp />,
  },
  {
    path: '/events',
    element: (
      <PrivateRoute>
        <EventList />
      </PrivateRoute>
    ),
  },
  {
    path: '/my-registrations',
    element: (
      <PrivateRoute>
        <MyRegistrations />
      </PrivateRoute>
    ),
  },
  {
    path: '/ticket/:eventId',
    element: (
      <PrivateRoute>
        <Ticket />
      </PrivateRoute>
    ),
  },
]);
