import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AppProvider from './Context/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <AppProvider>
      <App />
    </AppProvider>,
  
);
