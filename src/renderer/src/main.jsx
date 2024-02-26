import './main.css'
import Settings from './components/settings';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ContextProvider } from './ContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <App />
      <Settings />
    </ContextProvider>
  </React.StrictMode>
)
