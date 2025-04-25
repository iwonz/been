import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Map } from './components/Map/Map';
import { downloadBorders } from './utils/downloadBorders';
import { addScript } from './utils/addScript';
import { PLACES_CONFIG } from './config';

addScript(`https://api-maps.yandex.ru/2.1/?lang=${PLACES_CONFIG.mapLang}`, '', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.downloadBorders = downloadBorders;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Map />
    </React.StrictMode>,
  );
});
