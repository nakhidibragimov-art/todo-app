import { useEffect } from 'react';

// Calls handler when the Escape key is pressed (used to close dialogs)
export function useEscape(handler) {
  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handler]);
}
