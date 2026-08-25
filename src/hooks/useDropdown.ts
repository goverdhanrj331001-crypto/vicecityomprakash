'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * A hook that manages open/close state for a dropdown
 * and closes it when a click occurs outside the container element.
 */
export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, close]);

  return { isOpen, toggle, close, containerRef };
}
