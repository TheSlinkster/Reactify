import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'day' ? 'Switch to Night' : 'Switch to Day'}
    </button>
  );
};

export default ThemeToggle;
