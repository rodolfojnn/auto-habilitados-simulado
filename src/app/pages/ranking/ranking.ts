import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-8 max-w-lg mx-auto w-full flex flex-col font-sans h-full">
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
            </p>
          </header>

          <div class="flex flex-col gap-3 w-full max-w-sm mb-6">
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
                <span class="text-amber-700 dark:text-amber-400 font-bold text-sm">Aulas Práticas Grátis</span>
                <span class="text-xs text-amber-600/80 dark:text-amber-400/70 font-medium">Pacote extra com instrutor</span>
              </div>
            </div>

            <!-- 2nd Place -->
            <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl relative overflow-hidden">
              <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white flex flex-col items-center justify-center shrink-0 shadow-sm relative z-10 font-bold">
                2º
              </div>
              <div class="flex flex-col relative z-10 w-full">
                <span class="text-slate-700 dark:text-slate-300 font-bold text-sm">Curso Ao Vivo</span>
                <span class="text-xs text-slate-500 font-medium">Revisão com instrutor expert</span>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="flex items-center gap-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-2xl relative overflow-hidden">
              <div class="w-10 h-10 rounded-full bg-orange-400 text-white flex flex-col items-center justify-center shrink-0 shadow-sm relative z-10 font-bold">
                3º
              </div>
              <div class="flex flex-col relative z-10 w-full">
                <span class="text-orange-700 dark:text-orange-400 font-bold text-sm">Acesso VIP</span>
                <span class="text-xs text-orange-600/80 dark:text-orange-400/70 font-medium">Material de estudo exclusivo</span>
              </div>
            </div>
          </div>

          <div class="w-full mt-auto mt-4 max-w-sm">
            <button
              (click)="enterRanking()"
              class="w-full py-4 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20 active:scale-[0.98] uppercase tracking-wide">
              Quero Participar
            </button>
          </div>
        </div>
      } @else {
        <div class="animate-fade-in-up flex flex-col gap-6">
          <header class="mb-2 text-center relative">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ranking Semanal</h1>
            <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Dispute o topo com outros alunos</p>
            <button (click)="showPrizes.set(true)" class="absolute right-0 top-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-500 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <mat-icon class="!text-xl !w-5 !h-5 !leading-none">help_outline</mat-icon>
            </button>
          </header>

          <div class="bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
            <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
              <mat-icon class="!text-5xl !w-12 !h-12 !leading-none">calendar_month</mat-icon>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum ranking no momento</h2>
            <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed max-w-[250px]">
              Os resultados são agrupados e divulgados todo dia 20 de cada mês. Continue praticando para garantir seu lugar no topo!
            </p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RankingComponent implements OnInit {
  showPrizes = signal<boolean>(true);

  ngOnInit() {
    const hasSeen = localStorage.getItem('ranking_prizes_seen');
    if (hasSeen === 'true') {
      this.showPrizes.set(false);
    }
  }

  enterRanking() {
    localStorage.setItem('ranking_prizes_seen', 'true');
    this.showPrizes.set(false);
  }
}

