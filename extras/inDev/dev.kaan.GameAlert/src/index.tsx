import React from 'react';
import { Injector, settings } from 'replugged';
import { ReactDOM } from 'replugged/common'; // Assuming the correct import path for ReactDOM
import { NotificationRenderer } from './Notification';

const owo = await settings.init('dev.kaan.gamealert');
const injector = new Injector();

const container = document.createElement('div');
container.id = 'notification-container';
container.style.zIndex = '9999';
document.getElementById('app-mount').appendChild(container);

export function start() {
  ReactDOM.render(
    <NotificationRenderer />,
    container
  );
}

export function stop() {
  const container = document.getElementById('notification-container');
  if (container) {
    container.remove();
  }
  injector.uninjectAll();
}

start();
