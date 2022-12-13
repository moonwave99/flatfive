import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HotkeysProvider } from 'react-hotkeys-hook';
import App from './App';
import './i18n/i18n';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <HotkeysProvider initiallyActiveScopes={['sketch']}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HotkeysProvider>
);
