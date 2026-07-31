import { Component, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

interface ModulePerformance {
  correct: number;
  incorrect: number;
}

interface SimulationResult {
  date: string;
  score: number;
  approved: boolean;
  points_earned?: number;
  modulePerformance?: Record<string, ModulePerformance>;
}

interface OnboardingAnswers {
  simulations?: SimulationResult[];
  [key: string]: unknown;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [MatIconModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 font-sans pb-24">

      <header>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Estatísticas e Histórico</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Acompanhe seu desempenho e melhore</p>
      </header>

      @if (totalSimulations() > 0) {

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-3xl border border-blue-100 dark:border-blue-500/20 flex flex-col items-center text-center shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 shrink-0">
              <mat-icon class="!w-7 !h-7 !text-[28px] leading-none flex items-center justify-center !text-blue-600 dark:!text-blue-400">analytics</mat-icon>
            </div>
            <span class="text-3xl font-black text-gray-900 dark:text-white">{{ totalSimulations() }}</span>
            <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1">Simulados</span>
          </div>

          <div class="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 flex flex-col items-center text-center shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shrink-0">
              <mat-icon class="!w-7 !h-7 !text-[28px] leading-none flex items-center justify-center !text-emerald-600 dark:!text-emerald-400">emoji_events</mat-icon>
            </div>
            <span class="text-3xl font-black text-gray-900 dark:text-white">{{ approvalRate() }}%</span>
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-1">Aprovação</span>
          </div>
        </div>

        @if (weakestModules().length > 0) {
          <div class="bg-amber-500/10 dark:bg-amber-500/10 p-5 rounded-3xl border border-amber-200/80 dark:border-amber-500/20 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-11 h-11 bg-amber-500/20 dark:bg-amber-400/20 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/30 dark:border-amber-400/30">
                <mat-icon class="!w-6 !h-6 !text-[24px] leading-none flex items-center justify-center text-amber-700 dark:text-amber-300" style="color: #b45309;">lightbulb</mat-icon>
              </div>
              <div>
                <h3 class="font-bold text-amber-950 dark:text-amber-200 text-base">Foque nestas matérias</h3>
                <p class="text-xs text-amber-800/80 dark:text-amber-400/90 mt-0.5">Assuntos com menor aproveitamento</p>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              @for (mod of weakestModules(); track mod.module) {
                <div>
                  <div class="flex justify-between text-xs mb-1.5 text-amber-950 dark:text-amber-200">
                    <span class="font-semibold truncate pr-4">{{ mod.module }}</span>
                    <span class="font-black shrink-0 text-amber-900 dark:text-amber-300">{{ Math.round(mod.rate) }}%</span>
                  </div>
                  <div class="w-full bg-amber-200/70 dark:bg-amber-950/60 rounded-full h-2.5 overflow-hidden">
                    <div class="bg-amber-600 dark:bg-amber-400 h-full rounded-full transition-all duration-500" [style.width]="mod.rate + '%'"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Histórico Detalhado</h2>
          <div class="flex flex-col gap-4">
            @for (sim of simulations(); track sim.date) {
              <div class="bg-white dark:bg-slate-800 hover:dark:bg-slate-700/80 transition-colors p-5 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-4">

                <!-- Top Row -->
                <div class="flex align-center justify-between">
                  <div class="flex items-center gap-4">
                    @if (sim.approved) {
                      <div class="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <mat-icon class="!w-6 !h-6 !text-[24px] leading-none flex items-center justify-center !text-emerald-600 dark:!text-emerald-400">check_circle</mat-icon>
                      </div>
                    } @else {
                      <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <mat-icon class="!w-6 !h-6 !text-[24px] leading-none flex items-center justify-center !text-rose-600 dark:!text-rose-400">cancel</mat-icon>
                      </div>
                    }
                    <div>
                      <h3 class="font-bold text-gray-900 dark:text-white">{{ sim.approved ? 'Aprovado' : 'Reprovado' }}</h3>
                      <p class="text-xs font-medium text-gray-500 dark:text-slate-400 mt-0.5">{{ sim.date | date:'dd/MM/yyyy HH:mm' }} • {{ 30 - sim.score }} erros</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end justify-center">
                    <span class="text-xl font-black" [class.text-emerald-500]="sim.approved" [class.text-rose-500]="!sim.approved" [class.dark:text-emerald-400]="sim.approved" [class.dark:text-rose-400]="!sim.approved">
                      {{ Math.round((sim.score / 30) * 100) }}%
                    </span>
                    @if (sim.points_earned !== undefined) {
                      <span class="text-[10px] font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded-full mt-1">+{{ sim.points_earned }} pts</span>
                    }
                  </div>
                </div>

                <!-- Module Performance Section -->
                @if (sim.modulePerformance) {
                  <div class="pt-4 mt-2 border-t border-slate-100 dark:border-white/5">
                    <div class="grid grid-cols-1 gap-3">
                      @for (item of getModuleStats(sim.modulePerformance); track item.module) {
                        <div class="flex items-center justify-between text-xs">
                          <span class="text-slate-600 dark:text-slate-300 font-medium truncate pr-3 flex-1" [title]="item.module">{{ item.module }}</span>
                          <div class="flex items-center gap-2 shrink-0">
                            @if (item.correct > 0) {
                              <span class="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">{{ item.correct }} acertos</span>
                            }
                            @if (item.incorrect > 0) {
                              <span class="text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md">{{ item.incorrect }} erros</span>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

              </div>
            }
          </div>
        </div>

      } @else {
        <div class="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center mt-4">
          <div class="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-5 shadow-sm">
            <mat-icon class="material-icons !text-4xl !w-10 !h-10 !leading-none">history</mat-icon>
          </div>
          <h3 class="font-bold text-slate-800 dark:text-white text-xl mb-2">Nenhum simulado</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">Você ainda não completou nenhum simulado. Seus resultados aparecerão aqui.</p>
        </div>
      }

    </div>
  `
})
export class HistoryComponent implements OnInit {
  simulations = signal<SimulationResult[]>([]);
  readonly Math = Math;

  totalSimulations = computed(() => this.simulations().length);

  approvalRate = computed(() => {
    const sims = this.simulations();
    if (sims.length === 0) return 0;
    const approved = sims.filter(s => s.approved).length;
    return Math.round((approved / sims.length) * 100);
  });

  moduleStats = computed(() => {
    const sims = this.simulations();
    const stats: Record<string, { correct: number, incorrect: number }> = {};
    for (const sim of sims) {
      if (sim.modulePerformance) {
        for (const [module, perf] of Object.entries(sim.modulePerformance)) {
          if (!stats[module]) stats[module] = { correct: 0, incorrect: 0 };
          stats[module].correct += perf.correct;
          stats[module].incorrect += perf.incorrect;
        }
      }
    }

    return Object.entries(stats).map(([module, perf]) => {
      const total = perf.correct + perf.incorrect;
      const rate = total > 0 ? (perf.correct / total) * 100 : 0;
      return {
        module,
        correct: perf.correct,
        incorrect: perf.incorrect,
        total,
        rate
      };
    }).sort((a, b) => b.rate - a.rate);
  });

  weakestModules = computed(() => {
    const stats = this.moduleStats();
    // Only show modules where the user has answered at least some questions
    // and the rate is less than 100% to actually show "weak" points.
    // Also limit to top 3 weakest modules
    return stats
      .filter(s => s.total >= 3 && s.rate < 100)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 3);
  });

  ngOnInit() {
    this.loadHistory();
  }

  getModuleStats(perf: Record<string, ModulePerformance>) {
    return Object.keys(perf).map(key => ({
      module: key,
      ...perf[key]
    })).sort((a, b) => (b.correct + b.incorrect) - (a.correct + a.incorrect));
  }

  loadHistory() {
    try {
      const data = localStorage.getItem('onboarding_answers') || '{}';
      const answers = JSON.parse(data) as OnboardingAnswers;
      if (answers && answers.simulations) {
        // Sort descending by date (newest first)
        const sorted = answers.simulations.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.simulations.set(sorted);
      }
    } catch(e) {
      console.error('Error loading history', e);
    }
  }
}

