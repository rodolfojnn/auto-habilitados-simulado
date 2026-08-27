import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppStoreService } from '../../app-store.service';
import { PushService } from '../../push.service';
import { Capacitor } from '@capacitor/core';
import { MatIconModule } from '@angular/material/icon';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-enable-push',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-[999] bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-md">

      <div class="w-full max-w-sm flex flex-col items-center animate-slide-up">
        <!-- Visual/Icon -->
        <div class="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-8 relative shadow-inner">
          <mat-icon class="material-icons !text-5xl !w-12 !h-12 !leading-none text-brand-500 dark:text-green-400">notifications_active</mat-icon>

          <!-- Animated pulse rings -->
          <div class="absolute inset-0 border-4 border-brand-500/20 dark:border-green-400/20 rounded-full animate-ping" style="animation-duration: 2s;"></div>

          <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></div>
        </div>

        <!-- Typography -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Ative as Notificações
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 px-4">
          Isso garante que você receba alertas imediatos do chat, além de ficar por dentro de todos os lembretes e avisos importantes.
        </p>

        <!-- Actions -->
        @if (store.pushPermission() === 'prompt' || store.pushPermission() === 'prompt-with-rationale' || store.pushPermission() === null) {
          <button
            (click)="requestPush()"
            class="w-full py-4 rounded-xl font-bold text-slate-950 bg-brand-500 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20 active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            Permitir Notificações
            <mat-icon class="material-icons !text-xl !w-5 !h-5 !leading-none">arrow_forward</mat-icon>
          </button>

          @if (isIos) {
            <button
              (click)="declinePushIos()"
              class="mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              Recusar
            </button>
          }
        } @else if (store.pushPermission() === 'denied') {
          <div class="w-full p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl mb-6 border border-orange-100 dark:border-orange-800/30 text-left flex gap-3 shadow-sm">
            <mat-icon class="material-icons !text-2xl !w-6 !h-6 !leading-none text-orange-500 shrink-0 mt-0.5">warning</mat-icon>
            <div>
              <h3 class="font-bold text-orange-900 dark:text-orange-200 text-sm mb-1">Permissão Negada</h3>
              <p class="text-xs text-orange-800 dark:text-orange-300">
                Você recusou as notificações. Para o funcionamento correto do aplicativo, <strong class="font-bold">é obrigatório</strong> ativá-las.
              </p>
            </div>
          </div>

          <!-- Open settings / Re-check -->
          <div class="w-full flex flex-col gap-3">
             <button
              (click)="openSettings()"
              class="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors active:scale-[0.98] uppercase tracking-wide"
             >
               Abrir Configurações
             </button>
             <button
              (click)="recheck()"
              class="w-full py-4 rounded-xl font-bold text-brand-600 dark:text-green-400 bg-brand-50 hover:bg-brand-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 transition-colors active:scale-[0.98] uppercase tracking-wide"
             >
               Já ativei. Verificar novamente
             </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; backdrop-filter: blur(0px); }
      to { opacity: 1; backdrop-filter: blur(8px); }
    }

    .animate-slide-up {
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class EnablePushComponent {
  store = inject(AppStoreService);
  pushS = inject(PushService);
  isIos = Capacitor.getPlatform() === 'ios';

  requestPush() {
    this.pushS.requestPermissions();
  }

  declinePushIos() {
    localStorage.setItem('pushDeclinedIos', 'true');
    this.store.pushDeclinedIos.set(true);
  }

  recheck() {
    this.pushS.checkAndRegister();
  }

  openSettings() {
    NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App
    });
  }
}
