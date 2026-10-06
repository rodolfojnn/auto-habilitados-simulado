import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Capacitor } from '@capacitor/core';
import { PushService } from '../../push.service';
import { AppStoreService } from '../../app-store.service';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-ranking',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-8 max-w-lg mx-auto w-full flex flex-col font-sans min-h-full pb-12">
      @if (showPrizes()) {
        <div class="animate-fade-in-up flex flex-col gap-6 items-center flex-1 pb-10">
          <div class="w-16 h-16 bg-amber-50 dark:bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 dark:text-amber-400 mt-4 mb-2">
            <mat-icon class="!text-3xl !w-8 !h-8 !leading-none">card_giftcard</mat-icon>
          </div>

          <header class="text-center px-4 mb-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Prêmios do Ranking</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Os melhores do simulado e duelo multiplayer podem ganhar prêmios!
              Dispute com outros alunos e alcance o topo da classificação nacional para ser um dos vencedores.
              Obs: os pontos de meses anteriores não são cumulativos!
            </p>
          </header>

          <div class="flex flex-col gap-3 w-full max-w-sm mb-2">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-1">Prêmios Nacionais</h3>

            <!-- 1st Place -->
            <div class="flex items-center gap-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl relative overflow-hidden">
              <div class="absolute -right-2 -bottom-2 text-amber-200 dark:text-amber-500/10">
                <mat-icon class="!text-6xl !w-16 !h-16">emoji_events</mat-icon>
              </div>
              <div class="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-amber-400/40 relative z-10 font-bold">
                1º
              </div>
              <div class="flex flex-col relative z-10 w-full">
                <span class="text-amber-700 dark:text-amber-400 font-bold text-sm">10 Aulas Práticas - Cupom</span>
                <span class="text-xs text-amber-600/80 dark:text-amber-400/70 font-medium">Desconto no app Dirigir Agora - 10%</span>
              </div>
            </div>

            <!-- 2nd Place -->
            <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl relative overflow-hidden">
              <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white flex flex-col items-center justify-center shrink-0 shadow-sm relative z-10 font-bold">
                2º
              </div>
              <div class="flex flex-col relative z-10 w-full">
                <span class="text-slate-700 dark:text-slate-300 font-bold text-sm">Curso Teórico ao Vivo</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Revisão com instrutor expert - Grátis</span>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="flex items-center gap-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-2xl relative overflow-hidden">
              <div class="w-10 h-10 rounded-full bg-orange-400 text-white flex flex-col items-center justify-center shrink-0 shadow-sm relative z-10 font-bold">
                3º
              </div>
              <div class="flex flex-col relative z-10 w-full">
                <span class="text-orange-700 dark:text-orange-400 font-bold text-sm">4 Aulas Práticas - Cupom</span>
                <span class="text-xs text-orange-600/80 dark:text-orange-400/70 font-medium">Desconto no app Dirigir Agora - 10%</span>
              </div>
            </div>
          </div>

          <div class="w-full max-w-sm rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 text-left">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <mat-icon class="!text-xl !w-5 !h-5 !leading-none">notifications_active</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-emerald-900 dark:text-emerald-300">Como receber o prêmio?</p>
                <p class="text-xs text-emerald-800 dark:text-emerald-200/80 mt-1 leading-relaxed">
                  A notificação para os ganhadores será feita diretamente via <span class="font-bold">push notification</span> no seu celular. Mantenha as notificações ativas no app para receber o aviso e garantir seu prêmio!
                </p>
              </div>
            </div>
          </div>

          <div class="w-full mt-auto pt-2 max-w-sm">
            <button
              type="button"
              (click)="enterRanking()"
              class="w-full py-4 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20 active:scale-[0.98] uppercase tracking-wide">
              Quero Participar
            </button>
          </div>
        </div>
      } @else {
        <div class="animate-fade-in-up flex flex-col gap-6">
          <header class="mb-1 text-center relative">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ranking</h1>
            <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Dispute o topo com outros alunos</p>
            <button
              type="button"
              (click)="showPrizes.set(true)"
              aria-label="Ver prêmios do ranking"
              class="absolute right-0 top-0 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-brand-500 transition-colors bg-gray-100 dark:bg-slate-800 rounded-full shadow-2xs">
              <mat-icon class="!text-xl !w-5 !h-5 !leading-none">help_outline</mat-icon>
            </button>
          </header>

          <!-- Quadro de Vencedores e Pontuações -->
          <div class="flex flex-col gap-3.5 mt-2 relative">
            <h2 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center mb-1">
              Vencedores - Setembro / 2026
            </h2>

            <!-- 1st Place -->
            <div class="flex items-center gap-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl relative overflow-hidden shadow-2xs">
              <div class="absolute -right-2 -bottom-2 text-amber-200 dark:text-amber-500/10 pointer-events-none">
                <mat-icon class="!text-6xl !w-16 !h-16">emoji_events</mat-icon>
              </div>
              <div class="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex flex-col items-center justify-center shrink-0 shadow-md shadow-amber-400/30 relative z-10 font-black text-lg tabular-nums">
                1
              </div>
              <div class="flex flex-col relative z-10 flex-1 min-w-0">
                <span class="text-amber-900 dark:text-amber-400 font-bold text-base truncate">Elizeu</span>
                <span class="text-xs text-amber-700/80 dark:text-amber-400/70 font-medium truncate">Paulínia - SP</span>
              </div>
              <div class="relative z-10 font-bold text-amber-600 dark:text-amber-500 pr-1 tabular-nums shrink-0">
                15858 pts
              </div>
            </div>

            <!-- 2nd Place -->
            <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl relative overflow-hidden shadow-2xs">
              <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white flex flex-col items-center justify-center shrink-0 shadow-2xs relative z-10 font-black text-lg tabular-nums">
                2
              </div>
              <div class="flex flex-col relative z-10 flex-1 min-w-0">
                <span class="text-slate-800 dark:text-slate-200 font-bold text-base truncate">Mauro</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">Espírito Santo do Pinhal - SP</span>
              </div>
              <div class="relative z-10 font-bold text-slate-600 dark:text-slate-400 pr-1 tabular-nums shrink-0">
                9285 pts
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="flex items-center gap-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-2xl relative overflow-hidden shadow-2xs">
              <div class="w-10 h-10 rounded-full bg-orange-400 text-white flex flex-col items-center justify-center shrink-0 shadow-2xs relative z-10 font-black text-lg tabular-nums">
                3
              </div>
              <div class="flex flex-col relative z-10 flex-1 min-w-0">
                <span class="text-orange-900 dark:text-orange-300 font-bold text-base truncate">Maria</span>
                <span class="text-xs text-orange-700/80 dark:text-orange-400/70 font-medium truncate">Tibau - RN</span>
              </div>
              <div class="relative z-10 font-bold text-orange-600 dark:text-orange-500 pr-1 tabular-nums shrink-0">
                7151 pts
              </div>
            </div>
          </div>

          <!-- Card de Notificação via Push aos Ganhadores -->
          <section class="rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            <div class="flex items-start gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <mat-icon class="!text-2xl !w-6 !h-6 !leading-none">notifications_active</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-bold text-gray-900 dark:text-white leading-snug">
                  Aviso aos Ganhadores
                </h3>
                <p class="text-xs text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">
                  A notificação para os ganhadores é enviada via <strong class="text-gray-900 dark:text-white">notificação push</strong> no seu celular.
                </p>
              </div>
            </div>

            <!-- Destaque Informativo -->
            <div class="bg-emerald-50/70 dark:bg-slate-900/60 rounded-xl p-3.5 border border-emerald-100 dark:border-slate-700 flex flex-col gap-2.5">
              <div class="flex items-start gap-2.5 text-xs text-emerald-950 dark:text-emerald-300">
                <mat-icon class="!text-base !w-4 !h-4 !leading-none text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">check_circle</mat-icon>
                <span class="leading-relaxed">
                  Fique atento: você precisa estar com as <strong class="font-bold">notificações ativas</strong> no aparelho para receber o comunicado e as orientações de resgate do seu prêmio.
                </span>
              </div>
            </div>

            <!-- Status do Push ou Ação de Ativação -->
            @if (isPushGranted()) {
              <div class="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-slate-900/40 border border-gray-200/80 dark:border-slate-700 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <mat-icon class="!text-base !w-4 !h-4 !leading-none text-emerald-600 dark:text-emerald-400">verified</mat-icon>
                <span>Suas notificações estão ativas neste dispositivo</span>
              </div>
            } @else if (!isWebPlatform) {
              <div class="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  (click)="enablePush()"
                  class="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-brand-500 hover:bg-brand-400 transition-colors shadow-sm shadow-brand-500/20 active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide">
                  <mat-icon class="!text-lg !w-5 !h-5 !leading-none">notifications_active</mat-icon>
                  <span>Ativar Notificações</span>
                </button>
                <p class="text-[11px] text-gray-500 dark:text-slate-400 text-center">
                  Toque para autorizar e garantir o recebimento dos avisos do ranking.
                </p>
              </div>
            }
          </section>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RankingComponent implements OnInit {
  private pushService = inject(PushService);
  private store = inject(AppStoreService);

  showPrizes = signal<boolean>(false);
  isWebPlatform = Capacitor.getPlatform() === 'web';

  isPushGranted = computed(() => {
    return this.store.pushPermission() === 'granted';
  });

  ngOnInit() {
    localStorage.setItem('ranking_prizes_seen', 'true');
    if (!this.isWebPlatform) {
      this.pushService.checkAndRegister();
    }
  }

  enterRanking() {
    localStorage.setItem('ranking_prizes_seen', 'true');
    this.showPrizes.set(false);
  }

  enablePush() {
    if (this.isWebPlatform) return;

    const perm = this.store.pushPermission();
    if (perm === 'denied') {
      NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App
      });
    } else {
      this.pushService.requestPermissions();
    }
  }
}
