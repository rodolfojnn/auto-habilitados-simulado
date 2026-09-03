import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AppStoreService } from './app-store.service';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal';
import { EnablePushComponent } from './components/enable-push/enable-push';
import { LeadCaptureComponent } from './components/lead-capture/lead-capture';
import { PushService } from './push.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, ConfirmModalComponent, LeadCaptureComponent, EnablePushComponent, ChatbotComponent],
  template: `
    @if (!leadCaptured()) {
      <div class="fixed inset-0 z-[100] bg-gray-50 dark:bg-slate-900 overflow-y-auto">
        <app-lead-capture (captured)="onLeadCaptured()"
            title="Completar Cadastro"
            description="Precisamos de algumas informações para continuar.">
        </app-lead-capture>
      </div>
    } @else if (needsPushPermission()) {
      <app-enable-push></app-enable-push>
    } @else {
      <div class="h-full flex flex-col lg:flex-row bg-white dark:bg-slate-900 transition-colors duration-200 text-gray-900 dark:text-gray-100 font-sans">

      <!-- Top App Bar (Mobile Only) -->
      <header class="lg:hidden shrink-0 sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 shadow-sm transition-colors duration-200">
        <div class="flex items-center justify-between px-4 h-16">
          <div class="flex items-center gap-3">
            <button (click)="toggleSidebar()" class="p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <mat-icon class="material-icons !leading-none">menu</mat-icon>
            </button>
            <!-- <span class="font-bold text-lg text-brand-600 dark:text-white">
              Simulado CNH do Brasil
            </span> -->
          </div>

          @if (!isWebPlatform) {
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-sm border border-amber-200 dark:border-amber-500/30 transition-all">
            <mat-icon class="material-icons !text-lg !leading-none !w-5 !h-5">stars</mat-icon>
            <span>{{ userPoints() }} pts</span>
          </div>
          }
        </div>
      </header>

      <!-- Sidebar Overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-gray-900/50 dark:bg-slate-950/80 z-50 lg:hidden backdrop-blur-sm transition-opacity" (click)="closeSidebar()" (keydown.enter)="closeSidebar()" tabindex="0"></div>
      }

      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-[60] w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:shrink-0 flex flex-col"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Sidebar Header -->
        <div class="h-max min-h-[80px] lg:min-h-[100px] flex items-center px-6 border-b border-gray-100 dark:border-white/5 shrink-0 lg:border-none py-4">
          <div class="flex-1 flex items-center h-16 lg:h-20">
            <img
              src="assets/logo-simulado.png"
              alt="Simulado CNH do Brasil"
              class="max-h-full max-w-full object-contain drop-shadow-md object-left"
            />
          </div>
          <button (click)="closeSidebar()" class="lg:hidden ml-auto p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <mat-icon class="material-icons !leading-none">close</mat-icon>
          </button>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">

          <p class="px-2 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Principal</p>

          <a routerLink="/" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" [routerLinkActiveOptions]="{exact: true}" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">home</mat-icon>
            <span>Início</span>
          </a>

          <a routerLink="/simulado" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">local_taxi</mat-icon>
            <span>Iniciar Simulado</span>
          </a>

          <a routerLink="/historico" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">history</mat-icon>
            <span>Histórico</span>
          </a>

          <a routerLink="/ranking" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">emoji_events</mat-icon>
            <span>Ranking Mensal</span>
          </a>

          <a routerLink="/duelo" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">sports_esports</mat-icon>
            <span>Duelo</span>
          </a>

          <p class="px-2 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-4">Configurações</p>

          <button (click)="toggleTheme()" class="flex items-center w-full gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium text-left">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            <span>Tema {{ isDark() ? 'Claro' : 'Escuro' }}</span>
          </button>

          <button (click)="resetApp()" class="flex items-center w-full gap-3 px-4 py-3 min-h-[52px] rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group font-medium text-left mt-2">
            <mat-icon class="material-icons group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">refresh</mat-icon>
            <span>Refazer Questionário</span>
          </button>

        </nav>

        <!-- Sidebar Footer -->
        <div class="px-6 py-6 border-t border-gray-100 dark:border-white/5 shrink-0">
          <div class="flex items-center justify-between lg:justify-start lg:gap-4 mb-4 lg:mb-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-100 dark:bg-emerald-500 flex items-center justify-center text-brand-600 dark:text-slate-900 font-bold">{{ userInitials() }}</div>
              <div class="hidden lg:block">
                <p class="text-sm font-semibold text-gray-900 dark:text-white leading-none mb-1">{{ userName() }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 leading-none">Simulador</p>
              </div>
            </div>

            @if (!isWebPlatform) {
            <div class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-sm border border-amber-200 dark:border-amber-500/30 transition-all ml-auto">
              <mat-icon class="material-icons !text-lg !leading-none !w-5 !h-5">stars</mat-icon>
              <span>{{ userPoints() }} pts</span>
            </div>
            }
          </div>
        </div>

      </aside>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-y-auto">
        <router-outlet></router-outlet>
      </main>

      </div>

      <!-- Deixar o chat oculto por enquanto, futuramente vamos ativar, então não excluir o comentário abaixo -->
      <!-- <app-chat></app-chat> -->
      <app-chatbot></app-chatbot>

      <app-confirm-modal
        [isOpen]="showResetModal()"
        title="Refazer Questionário"
        description="Tem certeza que deseja apagar todos os seus dados e refazer o questionário inicial? Esta ação não pode ser desfeita."
        confirmText="Sim, apagar e refazer"
        cancelText="Cancelar"
        icon="refresh"
        iconBgClass="bg-rose-100 dark:bg-rose-500/20"
        iconTextClass="text-rose-600 dark:text-rose-400"
        confirmButtonClasses="bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
        (confirmed)="confirmResetApp()"
        (cancelled)="showResetModal.set(false)">
      </app-confirm-modal>
    }
  `
})
export class App implements OnInit {
  sidebarOpen = signal(false);
  isDark = signal(false);
  leadCaptured = signal(true);
  userPoints = signal<number>(0);
  showResetModal = signal(false);

  userName = signal<string>('Aluno');
  userInitials = signal<string>('AL');
  isWebPlatform = Capacitor.getPlatform() === 'web';

  needsPushPermission = computed(() => {
    if (Capacitor.getPlatform() === 'web') return false;
    const perm = this.store.pushPermission();

    if (Capacitor.getPlatform() === 'ios') {
      if (this.store.pushDeclinedIos() || perm === 'denied') return false;
    }

    return perm !== 'granted';
  });

  private document = inject(DOCUMENT);
  private router = inject(Router);
  private pushService = inject(PushService);
  private store = inject(AppStoreService);

  constructor() {
    // Check if lead is captured
    try {
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const answers = JSON.parse(data);
        this.leadCaptured.set(answers['lead_captured'] === true);
      } else {
        this.leadCaptured.set(false);
      }
    } catch {
      this.leadCaptured.set(false);
    }

    this.updateThemeClass(this.isDark());

    const pointsStr = localStorage.getItem('user_points');
    if (pointsStr) {
      this.userPoints.set(parseInt(pointsStr, 10));
    } else {
      localStorage.setItem('user_points', '0');
    }
  }

  ngOnInit() {
    this.initGlobalRipple();
    this.initPointsSync();
    this.checkLeadData();
  }

  private checkLeadData() {
    try {
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const answers = JSON.parse(data);
        if (answers && answers['lead_data'] && answers['lead_data'].nome) {
          const leadData = answers['lead_data'];
          const name = leadData.nome.trim();
          this.userName.set(name);

          if (leadData.fone1) {
            const fone1Raw = leadData.fone1 || '';
            const fone1 = fone1Raw.replace(/\D/g, '');
            this.store.fone1.set(fone1);
          }

          const parts = name.split(' ').filter((p: string) => p.trim() !== '');
          if (parts.length >= 2) {
             this.userInitials.set(`${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase());
          } else if (parts.length === 1 && parts[0].length >= 1) {
             this.userInitials.set(parts[0].substring(0, 2).toUpperCase());
          }

          // Se temos lead_data, já podemos verificar permissões no background
          this.pushService.registerOnStartup();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private initPointsSync() {
    this.document.defaultView?.addEventListener('pointsUpdated', (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      this.userPoints.set(customEvent.detail);
    });
  }

  private initGlobalRipple() {
    this.document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('button, a, .cursor-pointer') as HTMLElement;
      if (!target || target.hasAttribute('disabled')) return;

      const computedStyle = window.getComputedStyle(target);
      const originalPosition = target.style.position || '';
      const originalOverflow = target.style.overflow || '';

      if (computedStyle.position === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';

      const rect = target.getBoundingClientRect();
      const ripple = this.document.createElement('span');

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple-effect');

      target.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        target.style.position = originalPosition;
        target.style.overflow = originalOverflow;
      }, 600);
    });
  }

  onLeadCaptured() {
    this.leadCaptured.set(true);
    this.checkLeadData();
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleTheme() {
    this.isDark.update(v => !v);
    this.updateThemeClass(this.isDark());
  }

  resetApp() {
    this.showResetModal.set(true);
    this.closeSidebar();
  }

  confirmResetApp() {
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_answers');
    localStorage.removeItem('user_points');
    this.userPoints.set(0);
    this.leadCaptured.set(false);
    this.showResetModal.set(false);
    this.closeSidebar();
    this.router.navigate(['/']);
  }

  private updateThemeClass(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
