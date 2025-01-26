import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'day', // default theme
  toggleTheme: () => {},
  
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'day' | 'dark'>('day');
  
  useEffect(() => {
    document.body.className = theme; // Dynamically update body class
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'dark' : 'day'));
  };
  

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
      
    </ThemeContext.Provider>
    
  );
};

export const useTheme = () => useContext(ThemeContext);

