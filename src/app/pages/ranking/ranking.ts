import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
                <mat-icon class="!text-xl !w-5 !h-5 !leading-none">mail_outline</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-emerald-900 dark:text-emerald-300">Como receber o prêmio?</p>
                <p class="text-xs text-emerald-800 dark:text-emerald-200/80 mt-1 leading-relaxed">
                  Se você for um dos ganhadores, entre em contato pelo e-mail <span class="font-bold">comercial&#64;dirigiragora.com.br</span> com seu <span class="font-semibold">nome completo, CEP e telefone para contato</span>.
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

          <!-- Card de Instruções para os Ganhadores (Light & Dark) -->
          <section class="rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            <div class="flex items-start gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <mat-icon class="!text-2xl !w-6 !h-6 !leading-none">workspace_premium</mat-icon>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-bold text-gray-900 dark:text-white leading-snug">
                  Você é um dos ganhadores?
                </h3>
                <p class="text-xs text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Entre em contato conosco por e-mail enviando os dados abaixo para receber o seu prêmio:
                </p>
              </div>
            </div>

            <!-- Lista de dados necessários -->
            <div class="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-3.5 border border-gray-100 dark:border-slate-700/60 flex flex-col gap-2">
              <div class="flex items-center gap-2.5 text-xs text-gray-700 dark:text-slate-200">
                <mat-icon class="!text-base !w-4 !h-4 !leading-none text-emerald-600 dark:text-emerald-400 shrink-0">check_circle</mat-icon>
                <span class="font-semibold">Nome completo</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gray-700 dark:text-slate-200">
                <mat-icon class="!text-base !w-4 !h-4 !leading-none text-emerald-600 dark:text-emerald-400 shrink-0">check_circle</mat-icon>
                <span class="font-semibold">CEP</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-gray-700 dark:text-slate-200">
                <mat-icon class="!text-base !w-4 !h-4 !leading-none text-emerald-600 dark:text-emerald-400 shrink-0">check_circle</mat-icon>
                <span class="font-semibold">Telefone para contato</span>
              </div>
            </div>

            <!-- E-mail para contato com botão de copiar -->
            <div class="flex flex-col gap-1.5">
              <span class="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                E-mail para envio dos dados:
              </span>
              <div class="flex items-center justify-between gap-2 bg-emerald-50/70 dark:bg-slate-900/70 border border-emerald-200 dark:border-slate-700 rounded-xl pl-3.5 pr-1.5 py-1.5">
                <div class="flex items-center gap-2 min-w-0">
                  <mat-icon class="!text-base !w-4 !h-4 !leading-none text-emerald-600 dark:text-emerald-400 shrink-0">mail_outline</mat-icon>
                  <span class="text-xs font-bold text-emerald-900 dark:text-emerald-300 truncate select-all">
                    comercial&#64;dirigiragora.com.br
                  </span>
                </div>
                <button
                  type="button"
                  (click)="copyEmail()"
                  [class]="emailCopied()
                    ? 'min-h-[38px] px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 bg-emerald-600 text-white'
                    : 'min-h-[38px] px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-600 shadow-2xs'">
                  <mat-icon class="!text-base !w-4 !h-4 !leading-none">{{ emailCopied() ? 'check' : 'content_copy' }}</mat-icon>
                  <span class="whitespace-nowrap">{{ emailCopied() ? 'Copiado!' : 'Copiar' }}</span>
                </button>
              </div>
            </div>
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
  readonly contactEmail = 'comercial@dirigiragora.com.br';

  showPrizes = signal<boolean>(false);
  emailCopied = signal<boolean>(false);

  ngOnInit() {
    localStorage.setItem('ranking_prizes_seen', 'true');
  }

  enterRanking() {
    localStorage.setItem('ranking_prizes_seen', 'true');
    this.showPrizes.set(false);
  }

  async copyEmail() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.contactEmail);
        this.showCopiedFeedback();
        return;
      }
    } catch {
      // Fallback below
    }
    const textarea = document.createElement('textarea');
    textarea.value = this.contactEmail;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch {
      // Ignore fallback error
    }
    document.body.removeChild(textarea);
    this.showCopiedFeedback();
  }

  private showCopiedFeedback() {
    this.emailCopied.set(true);
    setTimeout(() => this.emailCopied.set(false), 2500);
  }
}
