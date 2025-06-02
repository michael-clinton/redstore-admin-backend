import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ViewProfile from '../layout/Dashboard/Header/HeaderContent/Profile/ViewProfile';
import EditProfile from '../layout/Dashboard/Header/HeaderContent/Profile/EditProfile';
import PrivateRoute from './PrivateRoute';  // import PrivateRoute

// Lazy loaded components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const Offer = Loadable(lazy(() => import('pages/component-overview/offer')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

const MainRoutes = {
  path: '/',
  element: <PrivateRoute />,   // Wrap all child routes inside PrivateRoute
  children: [
    {
      element: <DashboardLayout />,  // Layout wrapping all the routes inside
      children: [
        { index: true, element: <DashboardDefault /> },
        { path: 'default', element: <DashboardDefault /> },
        { path: 'typography', element: <Typography /> },
        { path: 'color', element: <Color /> },
        { path: 'shadow', element: <Shadow /> },
        { path: 'sample-page', element: <SamplePage /> },
        { path: 'offer', element: <Offer /> },
        { path: 'profile/view', element: <ViewProfile /> },
        { path: 'profile/edit', element: <EditProfile /> },
      ],
    },
  ],
};

export default MainRoutes;
