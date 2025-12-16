import { Outlet } from 'react-router-dom';
import { BottomMenu } from './BottomMenu';

// Layout component to include BottomMenu on authenticated pages
export function AppLayout() {
  return (
    <>
      <Outlet />
      <BottomMenu />
    </>
  );
}
