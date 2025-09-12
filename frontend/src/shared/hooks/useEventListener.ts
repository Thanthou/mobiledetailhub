import { useEffect, useRef } from 'react';

/**
 * Hook for adding event listeners with automatic cleanup
 * @param eventName - The event name to listen for
 * @param handler - The event handler function
 * @param element - The element to attach the listener to (defaults to window)
 * @param options - Event listener options
 */
export const useEventListener = <T extends keyof WindowEventMap>(
  eventName: T,
  handler: (event: WindowEventMap[T]) => void,
  element: Window | Document | HTMLElement | null = typeof window !== 'undefined' ? window : null,
  options?: boolean | AddEventListenerOptions
) => {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: WindowEventMap[T]) => void>();

  // Update ref.current value if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Make sure element supports addEventListener
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[T]);
      }
    };

    // Add event listener
    element.addEventListener(eventName, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
};
