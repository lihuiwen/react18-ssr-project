import React from 'react';
import { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/Home';
import { AboutPage } from '../pages/About';
import { NotFoundPage } from '../pages/NotFound';

/**
 * Route configuration for both client and server
 * This configuration is isomorphic and works on both sides
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
