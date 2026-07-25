import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
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
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 font-sans">

      <header class="mb-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Histórico</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Veja seus resultados anteriores</p>
      </header>

      <div class="flex flex-col gap-3">
        @if (simulations().length === 0) {
          <div class="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center">
            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
              <mat-icon class="material-icons !text-3xl !w-8 !h-8 !leading-none">history</mat-icon>
            </div>
            <h3 class="font-bold text-slate-800 dark:text-white text-lg mb-1">Nenhum simulado</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Você ainda não completou nenhum simulado.</p>
          </div>
        } @else {
          @for (sim of simulations(); track sim.date) {
            <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 transition-colors p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col gap-4">

              <!-- Top Row -->
              <div class="flex align-center justify-between">
                <div class="flex items-center gap-4">
                  @if (sim.approved) {
                    <div class="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 p-2 rounded-xl">
                      <mat-icon class="material-icons !leading-none !w-6 !h-6">check_circle</mat-icon>
                    </div>
                  } @else {
                    <div class="bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 p-2 rounded-xl">
                      <mat-icon class="material-icons !leading-none !w-6 !h-6">cancel</mat-icon>
                    </div>
                  }
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ sim.approved ? 'Aprovado' : 'Reprovado' }}</h3>
                    <p class="text-xs text-gray-500 dark:text-slate-400">{{ sim.date | date:'dd/MM/yyyy HH:mm' }} • {{ 30 - sim.score }} erros</p>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <span class="font-bold text-gray-400 dark:text-slate-500">{{ Math.round((sim.score / 30) * 100) }}%</span>
                  @if (sim.points_earned !== undefined) {
                    <span class="text-[10px] font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded-full mt-1">+{{ sim.points_earned }} pts</span>
                  }
                </div>
              </div>

              <!-- Module Performance Section -->
              @if (sim.modulePerformance) {
                <div class="pt-3 border-t border-gray-100 dark:border-white/5">
                  <div class="grid grid-cols-1 gap-2.5">
                    @for (item of getModuleStats(sim.modulePerformance); track item.module) {
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-slate-600 dark:text-slate-400 font-medium truncate pr-2" [title]="item.module">{{ item.module }}</span>
                        <div class="flex items-center gap-1.5 shrink-0">
                          <span class="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">{{ item.correct }} acertos</span>
                          <span class="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded">{{ item.incorrect }} erros</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

            </div>
          }
        }
      </div>

    </div>
  `
})
export class HistoryComponent implements OnInit {
  simulations = signal<SimulationResult[]>([]);
  readonly Math = Math;

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
