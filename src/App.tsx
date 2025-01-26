
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
//import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import { useTheme } from './ThemeContext';
// import NeonLights from './components/NeonLights';
// import Clouds from './components/Clouds';
// import ZapManager from './components/ZapManager';
import apiService from './services/apiService';
import styled, { keyframes } from 'styled-components';
const App: React.FC = () => {
  const { theme } = useTheme();
  return (
    
    <div>
      {/* {theme === 'dark' && <Clouds />} */}
      {/* {theme === 'dark' && <NeonLights />} */}
      {/* {theme === 'dark' && <ZapManager />} */}
      <header>
      </header>
      <Router>
        <main>

        </main>
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<Home />} />
            
          </Routes>

        </AnimatePresence>
      </Router>
    </div>
  );
};

export default App;

