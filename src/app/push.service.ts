import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { App as CapacitorApp } from '@capacitor/app';
import { Router } from '@angular/router';
import { AppStoreService } from './app-store.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  private store = inject(AppStoreService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private listenersInitialized = false;

  async initPush() {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') return;

    this.initListeners();
    const permission = await this.checkPermission();
    this.store.pushPermission.set(permission);

    // pode chamar register() (se ainda não chamou ou para atualizar o token com o fone mais recente)
    if (permission === 'granted') {
      return PushNotifications.register();
    }

    // NÃO mostrar popup do sistema se não der
    if (permission === 'denied') {
      return;
    }

    // mostrar modal/prompt nativo explicando notificações
    if (permission === 'prompt' || permission === 'prompt-with-rationale') {
      this.requestPermissions();
    }
  }

  async registerOnStartup() {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') return;

    this.initListeners();

    const permission = await this.checkPermission();
    this.store.pushPermission.set(permission);

    // Apenas registra e envia o token pro backend se a permissão já estiver concedida
    if (permission === 'granted') {
      console.log('✅ Permissão push concedida, chamando PushNotifications.register()...');
      PushNotifications.register().catch(err => {
        console.error('❌ Falha ao chamar PushNotifications.register():', err);
      });
    } else {
      console.log('⚠️ Permissão push não concedida no registerOnStartup:', permission);
    }
  }

  initListeners() {
    if (this.listenersInitialized) return;
    this.listenersInitialized = true;

    CapacitorApp.addListener('appStateChange', async ({ isActive }) => {
      if (isActive && Capacitor.getPlatform() === 'ios') {
        const perm = await this.checkPermission();
        this.store.pushPermission.set(perm);
        if (perm === 'granted') {
          console.log('✅ Permissão push concedida no appStateChange, chamando PushNotifications.register()...');
          PushNotifications.register().catch(err => console.error(err));
        }
      }
    });

    // 🔑 Token gerado / atualizado
    PushNotifications.addListener('registration', (token) => {
      const platform  = Capacitor.getPlatform();

      let nome = '';
      let cep = '';
      let pontuacao = 0;

      try {
        const answersStr = localStorage.getItem('onboarding_answers');
        if (answersStr) {
          const answers = JSON.parse(answersStr);
          if (answers.lead_data) {
            nome = answers.lead_data.nome || '';
            cep = answers.lead_data.cep || '';
          }
        }
        pontuacao = parseInt(localStorage.getItem('user_points') || '0', 10);
      } catch (e) {
        console.error('Error parsing onboarding_answers or user_points', e);
      }

      console.log('Push token received:', token.value);
      console.log('Platform:', platform);
      console.log('Nome:', nome);
      console.log('CEP:', cep);
      console.log('Pontuação:', pontuacao);

      this.http.post('https://api.dirigiragora.com.br/v1/simulado/pushToken', {
        token: token.value,
        platform,
        nome,
        cep,
        pontuacao
      }).subscribe({
        next: () => console.log('Push token registered with backend successfully'),
        error: (err) => console.error('Error registering push token with backend:', err)
      });
    });

    // ❌ Erro ao registrar
    PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Erro push:', err);
    });

    // 📩 Push recebido (app aberto)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('📩 Push recebido:', notification);
    });

    // 👆 Usuário tocou na notificação
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('👉 Clique:', notification);
      const data = notification?.notification?.data;
      if (data) {
        if (data.url) {
          import('@capacitor/browser').then(({ Browser }) => {
            Browser.open({ url: data.url }).catch(err => console.error('Erro ao abrir URL:', err));
          });
        } else if (data.pagina) {
          this.router.navigate(['/' + data.pagina]);
        }
      }
    });
  }

  async checkAndRegister() {
    const perm = await this.checkPermission();
    this.store.pushPermission.set(perm);
    if (perm === 'granted') {
      console.log('✅ Permissão push concedida no checkAndRegister, chamando PushNotifications.register()...');
      PushNotifications.register().catch(err => console.error(err));
    }
  }

  requestPermissions() {
    console.log('Solicitando permissões de push...');
    PushNotifications.requestPermissions().then((result) => {
      console.log('Resultado da permissão de push:', result.receive);
      this.store.pushPermission.set(result.receive);
      if (result.receive === 'granted') {
         console.log('✅ Permissão concedida no prompt, chamando PushNotifications.register()...');
         PushNotifications.register().catch(err => console.error(err));
      }
    });
  }

  async checkPermission() {
    const result = await PushNotifications.checkPermissions();
    return result.receive;
  }

}
