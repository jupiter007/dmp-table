import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';

async function deferRender() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser.js');

  return worker.start();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
deferRender().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
