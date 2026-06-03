import { useContext } from 'react';
import { ContentContext } from './contentStore';

export const useSiteContent = () => {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used inside ContentProvider');
  }

  return context;
};
