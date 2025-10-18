import { useInRouterContext } from 'react-router-dom';
import { useEffect } from 'react';

export function useRouterDebug(name: string) {
  const inside = useInRouterContext();
  useEffect(() => console.log(`[RouterDebug] ${name} in router?`, inside), [inside]);
}
