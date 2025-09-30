import React, { lazy, Suspense } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/app-layouts';
import UrlProvider from './context';
import RequireAuth from './components/require-auth';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/landing'));
const Auth = lazy(() => import('./pages/auth'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Link = lazy(() => import('./pages/link'));
const RedirectPage = lazy(() => import('./pages/redirect-link'));

const withSuspense = (el) => <Suspense fallback={<div />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: withSuspense(<LandingPage />),
      },
      {
        path: '/auth',
        element: withSuspense(<Auth />),
      },
      {
        path: '/dashboard',
        element: withSuspense(
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: '/link/:id',
        element: withSuspense(
          <RequireAuth>
            <Link />
          </RequireAuth>
        ),
      },
      {
        path: '/:id',
        element: withSuspense(<RedirectPage />),
      },
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;