import { createBrowserRouter } from 'react-router-dom';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { EventList } from '../pages/EventList';
import { EventDetails } from '../pages/EventDetails';
import { MyRegistrations } from '../pages/MyRegistrations';
import { Ticket } from '../pages/Ticket';
import { CheckInScanner } from '../pages/CheckInScanner';
import { OrganizerDashboard } from '../pages/organizer/OrganizerDashboard';
import { CreateEvent } from '../pages/organizer/CreateEvent';
import { EventRegistrations } from '../pages/organizer/EventRegistrations';
import { PrivateRoute } from './PrivateRoute';
import { OrganizerRoute } from './OrganizerRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { Profile } from '../pages/Profile';
import { Friends } from '../pages/Friends';



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
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/events',
        element: <EventList />,
      },
      {
         path: '/events/:eventId',
         element: <EventDetails />,
      },
      {
        path: '/my-registrations',
        element: <MyRegistrations />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/friends',
        element: <Friends />,
      },
      {
        path: '/organizer',
        element: (
          <OrganizerRoute>
            <OrganizerDashboard />
          </OrganizerRoute>
        ),
      },
       {
        path: '/events/new',
        element: (
          <OrganizerRoute>
            <CreateEvent />
          </OrganizerRoute>
        ),
      },
      {
        path: '/events/:eventId/edit',
        element: (
          <OrganizerRoute>
            <CreateEvent />
          </OrganizerRoute>
        ),
      },
      {
        path: '/events/:eventId/registrations',
        element: (
          <OrganizerRoute>
             <EventRegistrations />
          </OrganizerRoute>
        ),
      },
    ],
  },
  // Fullscreen pages (no bottom menu)
  {
    path: '/events/:eventId/check-in',
    element: (
      <PrivateRoute>
        <OrganizerRoute>
          <CheckInScanner />
        </OrganizerRoute>
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
