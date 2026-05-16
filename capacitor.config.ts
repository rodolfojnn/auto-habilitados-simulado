import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.simulado.cnh.brasil',
  appName: 'Simulado CNH do Brasil',
  webDir: 'dist/app/browser',
  // server: {
  //   url: 'http://192.168.1.64:4255',
  //   cleartext: true
  // }
  plugins: {
    StatusBar: {
      overlaysWebView: true
    }
  }
};

export default config;
