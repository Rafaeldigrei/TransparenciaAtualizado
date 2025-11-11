import React, { createContext, useState, useContext } from 'react';

// Cria o contexto com um valor padrão
const ThemeContext = createContext();

// Cria o provedor que irá envolver o seu aplicativo
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Cria um hook customizado para usar o tema facilmente em qualquer componente
export const useTheme = () => useContext(ThemeContext);

