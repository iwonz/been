import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { TravelMap } from './components/Map/Map';
import { addScript } from './utils/addScript';
import { downloadBorders } from './utils/downloadBorders';

const rootElement = document.getElementById('root');
const apiLink = document.querySelector<HTMLLinkElement>('#yandex-maps-api');
if (!rootElement || !apiLink) {
  throw new Error('Root element or Yandex Maps preload is missing');
}

const apiReady = addScript(apiLink.href).then(
  () => new Promise<void>((resolve, reject) => ymaps.ready(() => resolve(), reject)),
);

window.downloadBorders = async () => {
  await apiReady;
  await downloadBorders();
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <TravelMap apiReady={apiReady} />
  </React.StrictMode>,
);
