/**
 * Custom hook for detecting clicks outside of an element
 */

import { useEffect, useRef } from 'react';

/**
 * Hook that triggers a callback when clicking outside of the referenced element
 * @param callback - Function to call when clicking outside
 * @returns Ref to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
}

/**
 * Hook for handling escape key press
 * @param callback - Function to call when escape is pressed
 * @param enabled - Whether the hook is enabled (default: true)
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);
}

/**
 * Hook that combines click outside and escape key detection
 * @param callback - Function to call when clicking outside or pressing escape
 * @param enabled - Whether the hook is enabled (default: true)
 * @returns Ref to attach to the element
 */
export function useCloseOnOutsideClick<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled: boolean = true
): React.RefObject<T> {
  const ref = useClickOutside<T>(enabled ? callback : () => {});
  useEscapeKey(callback, enabled);
  
  return ref;
}
