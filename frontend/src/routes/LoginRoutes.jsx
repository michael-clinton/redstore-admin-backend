import { lazy } from 'react';
import { Navigate } from 'react-router-dom';  // <-- Import Navigate here

// project imports
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    { index: true, element: <Navigate to="login" replace /> }, // Redirect root to /login
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> }
  ]
};

export default LoginRoutes;
