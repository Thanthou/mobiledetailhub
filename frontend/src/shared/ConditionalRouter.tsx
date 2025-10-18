import React from 'react';
import { BrowserRouter, useInRouterContext } from 'react-router-dom';

type Props = { children: React.ReactNode };

/**
 * Wraps children in a BrowserRouter only if we're NOT already inside one.
 * Prevents the "You cannot render a <Router> inside another <Router>" crash.
 */
export default function ConditionalRouter({ children }: Props) {
  const inRouter = useInRouterContext();
  return inRouter ? <>{children}</> : <BrowserRouter>{children}</BrowserRouter>;
}
