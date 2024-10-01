import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '@/layouts/Default';
import Dashboard from '@/pages/Dashboard/page';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';
import Auth from '@/pages/Auth/page';
import FriendProfile from '@/pages/Dashboard/[userId]/page';
import Add from '@/pages/Dashboard/add/page';
import Admin from '@/pages/Admin/page';
import AdminLayout from '@/layouts/Admin';
import UserProfile from '@/pages/Admin/[userId]/page';
import Create from '@/pages/Admin/create/page';

const RouterComponent = () => {
  const { user, loginWithCookie } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log('Login with cookie !');
      loginWithCookie();
    }
  }, [user, loginWithCookie]);

  const routes = [
    {
      path: '/',
      element: <Dashboard />,
      layout: DefaultLayout,
    },
    {
      path: '/add',
      element: <Add />,
      layout: DefaultLayout,
    },
    {
      path: '/:userId',
      element: <FriendProfile />,
      layout: DefaultLayout,
    },
    {
      path: '/auth',
      element: <Auth />,
      layout: null,
    },
    {
      path: '/admin',
      element: <Admin />,
      layout: AdminLayout,
    },
    {
      path: '/admin/create',
      element: <Create />,
      layout: AdminLayout,
    },
    {
      path: '/admin/:userId',
      element: <UserProfile />,
      layout: AdminLayout,
    },
  ];

  return (
    <Routes>
      {routes.map(({ path, element, layout: Layout }, i) => (
        <Route
          key={i}
          path={path}
          element={Layout ? <Layout>{element}</Layout> : element}
        />
      ))}
    </Routes>
  );
};

export default RouterComponent;
