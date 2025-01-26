import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the `.client` import
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './ThemeContext'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExamplesPage from './pages/ExamplesPage';
import DesktopEnviroment from './pages/DesktopEnviroment';

export default App;

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Correct usage of createRoot
  root.render(

    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/examples" element={<ExamplesPage />} />
              
            </Routes>
          </Router>
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}