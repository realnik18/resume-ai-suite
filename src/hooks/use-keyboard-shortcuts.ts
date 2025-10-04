import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlPressed = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
        const metaPressed = shortcut.meta ? event.metaKey : true;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlPressed &&
          metaPressed
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts() {
  const navigate = useNavigate();

  useKeyboardShortcuts([
    {
      key: '/',
      action: () => {
        // Focus global search
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
    },
    {
      key: 'n',
      action: () => {
        navigate('/app/resumes/new');
      },
    },
    {
      key: 'g',
      action: () => {
        // Listen for next key
        const handleNextKey = (event: KeyboardEvent) => {
          switch (event.key.toLowerCase()) {
            case 'r':
              navigate('/app/resumes');
              break;
            case 't':
              navigate('/app/tracker');
              break;
            case 'o':
              navigate('/app/overview');
              break;
          }
          document.removeEventListener('keydown', handleNextKey);
        };
        
        document.addEventListener('keydown', handleNextKey);
        
        // Remove listener after 2 seconds if no key is pressed
        setTimeout(() => {
          document.removeEventListener('keydown', handleNextKey);
        }, 2000);
      },
    },
  ]);
}