
import React from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/app-layouts'
import LandingPage from './pages/landing'
import Auth from './pages/auth'
import Dashboard from './pages/dashboard'
import Link from './pages/link'
import RedirectPage from './pages/redirect-link'
import UrlProvider from './context';
import RequireAuth from './components/require-auth';

const router = createBrowserRouter([
  {
    element: <AppLayout/>,
    children: [
      
      {
        path: '/',
        element: <LandingPage />
      },

      {
        path: "/auth",
        element: <Auth />
      },

      {
        path: "/dashboard",
        element: 
        <RequireAuth>
          <Dashboard />
          </RequireAuth>
      },

      {
        path: "/link/:id",
        element: <RequireAuth><Link /></RequireAuth>
      },

      {
        path: "/:id",
        element: <RedirectPage />
      }
    ]
  }
])

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
