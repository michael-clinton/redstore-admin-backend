import { createBrowserRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [MainRoutes, LoginRoutes] // no basename here
);

export default router;
