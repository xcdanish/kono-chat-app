import { useState, useCallback } from 'react';
import { AppSettings } from '../types';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    colorPalette: 'blue',
    fontSize: 'medium',
    fontStyle: 'inter'
  });

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setSettings(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  }, []);

  const isDarkMode = settings.theme === 'dark';

  return {
    settings,
    isDarkMode,
    updateSettings,
    toggleDarkMode
  };
};