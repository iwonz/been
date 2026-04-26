import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Map } from './components/Map/Map';
import { downloadBorders } from './utils/downloadBorders';
import { addScript } from './utils/addScript';
import { PLACES_CONFIG } from './config';

async function bootstrap() {
  await addScript(`https://api-maps.yandex.ru/2.1/?lang=${PLACES_CONFIG.mapLang}`);

  window.downloadBorders = downloadBorders;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Map />
    </React.StrictMode>,
  );
}

bootstrap();
