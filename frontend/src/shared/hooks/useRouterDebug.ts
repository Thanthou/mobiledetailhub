import { useInRouterContext } from 'react-router-dom';

export function useRouterDebug(name: string) {
  const inside = useInRouterContext();
  // Debug logging disabled - enable when debugging routing issues
  // useEffect(() => console.log(`[RouterDebug] ${name} in router?`, inside), [inside]);
}

