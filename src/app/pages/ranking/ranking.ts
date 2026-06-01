import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-8 max-w-lg mx-auto w-full flex flex-col font-sans">
      <div class="animate-fade-in-up flex flex-col gap-6">
        <header class="mb-2 text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ranking Semanal</h1>
          <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Dispute o topo com outros alunos</p>
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
export class RankingComponent {
}

