import { ChangeDetectionStrategy, Component, signal, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OnboardingComponent } from './pages/onboarding/onboarding';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, OnboardingComponent],
  template: `
    @if (!onboardingCompleted()) {
      <app-onboarding (completed)="finishOnboarding($event)"></app-onboarding>
    } @else {
      <div class="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 lg:flex text-gray-900 dark:text-gray-100 font-sans">

      <!-- Top App Bar (Mobile Only) -->
      <header class="lg:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 shadow-sm transition-colors duration-200">
        <div class="flex items-center justify-between px-4 h-16">
          <div class="flex items-center gap-3">
            <button (click)="toggleSidebar()" class="p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <mat-icon class="material-icons !leading-none">menu</mat-icon>
            </button>
            <span class="font-bold text-lg text-brand-600 dark:text-white">Simula Detran</span>
          </div>

          <button (click)="toggleTheme()" class="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <mat-icon class="material-icons !leading-none">{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </header>

      <!-- Sidebar Overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-gray-900/50 dark:bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm transition-opacity" (click)="closeSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 flex flex-col"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Sidebar Header -->
        <div class="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/5 shrink-0 lg:h-20 lg:border-none">
          <mat-icon class="material-icons text-brand-500 mr-2 !text-3xl">directions_car</mat-icon>
          <span class="font-bold text-xl text-gray-900 dark:text-white">Simula Detran</span>
          <button (click)="closeSidebar()" class="lg:hidden ml-auto p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <mat-icon class="material-icons !leading-none">close</mat-icon>
          </button>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">

          <p class="px-2 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Principal</p>

          <a routerLink="/" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" [routerLinkActiveOptions]="{exact: true}" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">home</mat-icon>
            <span>Início</span>
          </a>

          <a routerLink="/simulado" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">local_taxi</mat-icon>
            <span>Iniciar Simulado</span>
          </a>

          <a routerLink="/historico" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">history</mat-icon>
            <span>Histórico</span>
          </a>

          <a routerLink="/ranking" routerLinkActive="bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-emerald-400" (click)="closeSidebar()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors group font-medium">
            <mat-icon class="material-icons group-hover:text-brand-500 dark:group-hover:text-emerald-400 transition-colors">emoji_events</mat-icon>
            <span>Ranking Semanal</span>
          </a>

        </nav>

        <!-- Sidebar Footer -->
        <div class="px-6 py-6 border-t border-gray-100 dark:border-white/5 shrink-0">
          <div class="flex items-center justify-between lg:justify-start lg:gap-4 mb-4 lg:mb-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-100 dark:bg-emerald-500 flex items-center justify-center text-brand-600 dark:text-slate-900 font-bold">RO</div>
              <div class="hidden lg:block">
                <p class="text-sm font-semibold text-gray-900 dark:text-white leading-none mb-1">Rodolfo</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 leading-none">Aluno Aprendiz</p>
              </div>
            </div>
            <!-- Theme Toggle for Desktop -->
            <button (click)="toggleTheme()" class="hidden lg:flex p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ml-auto">
              <mat-icon class="material-icons !leading-none">{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
          </div>
        </div>

      </aside>

      <!-- Main Content -->
      <main class="flex-1 relative h-[calc(100vh-4rem)] lg:h-screen overflow-y-auto">
        <router-outlet></router-outlet>
      </main>

      </div>
    }
  `
})
export class App {
  sidebarOpen = signal(false);
  isDark = signal(false);
  onboardingCompleted = signal(true);

  constructor() {
    const isOnboarded = localStorage.getItem('onboarding_completed') === 'true';
    this.onboardingCompleted.set(isOnboarded);
    this.updateThemeClass(this.isDark());
  }

  finishOnboarding(answers: Record<string, string>) {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_answers', JSON.stringify(answers));
    this.onboardingCompleted.set(true);
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

  private updateThemeClass(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
