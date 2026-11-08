import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { TravelMap } from './components/Map/Map';
import { PLACES_CONFIG } from './config';
import { addScript } from './utils/addScript';
import { downloadBorders } from './utils/downloadBorders';

async function bootstrap() {
  await addScript(
    `https://api-maps.yandex.ru/2.1/?apikey=7f1d94ed-403e-46a8-8c29-7433e558dc74&lang=${PLACES_CONFIG.mapLang}`,
  );

  window.downloadBorders = downloadBorders;

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element #root is missing');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TravelMap />
    </React.StrictMode>,
  );
}

bootstrap();
