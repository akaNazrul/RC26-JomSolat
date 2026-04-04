import { useEffect } from 'react';

/**
 * Custom hook to manage page title and meta description
 * Eliminates duplicate meta tag logic across pages
 */
export const usePageMetadata = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute('content', description);
    } else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = description;
      document.head.appendChild(m);
    }
  }, [title, description]);
};
