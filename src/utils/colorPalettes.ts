export const colorPalettes = {
  blue: {
    primary: '#3B82F6',
    secondary: '#DBEAFE',
    light: '#EFF6FF',
    dark: '#1E40AF'
  },
  green: {
    primary: '#10B981',
    secondary: '#D1FAE5',
    light: '#ECFDF5',
    dark: '#047857'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#EDE9FE',
    light: '#F5F3FF',
    dark: '#5B21B6'
  },
  orange: {
    primary: '#F59E0B',
    secondary: '#FEF3C7',
    light: '#FFFBEB',
    dark: '#D97706'
  }
};

export const getColorPalette = (palette: string) => {
  return colorPalettes[palette as keyof typeof colorPalettes] || colorPalettes.blue;
};

export const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  dnd: 'bg-red-500',
  invisible: 'bg-gray-400'
};

export const statusLabels = {
  online: 'Online',
  away: 'Away',
  dnd: 'Do not disturb',
  invisible: 'Offline'
};