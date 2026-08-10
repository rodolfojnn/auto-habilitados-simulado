import { bootstrapApplication } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { App } from './app/app';
import { appConfig } from './app/app.config';

function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'web') {
    return true;
  }
  if ((window as any).Capacitor?.isNative) {
    return true;
  }
  return false;
}

function checkAndroidWebRedirect(): boolean {
  if (typeof window === 'undefined' || !navigator) return false;

  // Do not redirect if running inside native app (Capacitor Android or iOS WebView)
  if (isNativeApp()) {
    return false;
  }

  // Do not redirect if already on the target domain
  if (window.location.hostname.includes('simuladocnhdobrasil.com.br')) {
    return false;
  }

  const userAgent = navigator.userAgent || '';
  const isAndroid = /android/i.test(userAgent);

  if (isAndroid) {
    window.location.replace('https://www.simuladocnhdobrasil.com.br');
    return true;
  }

  return false;
}

if (!checkAndroidWebRedirect()) {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
