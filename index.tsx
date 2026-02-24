
import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Import App as a named export since it is not the default export in App.tsx
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);