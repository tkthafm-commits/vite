import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

window.addEventListener('error', (e) => {
  document.getElementById('root').innerHTML = `<pre style="color:red;padding:40px;font-size:14px">UNCAUGHT ERROR:\n${e.message}\n\n${e.filename}:${e.lineno}</pre>`;
});
window.addEventListener('unhandledrejection', (e) => {
  document.getElementById('root').innerHTML = `<pre style="color:red;padding:40px;font-size:14px">UNHANDLED PROMISE:\n${e.reason}</pre>`;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
