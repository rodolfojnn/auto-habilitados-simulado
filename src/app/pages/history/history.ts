import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 font-sans">
      
      <header class="mb-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Histórico</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Veja seus resultados anteriores</p>
      </header>

      <div class="flex flex-col gap-3">
        <!-- Placeholder items -->
        <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 transition-colors p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm">
           <div class="flex items-center gap-4">
             <div class="bg-red-50 text-red-500 dark:bg-red-500/20 p-2 rounded-xl">
               <mat-icon class="material-icons !leading-none !w-6 !h-6">cancel</mat-icon>
             </div>
             <div>
               <h3 class="font-semibold text-gray-900 dark:text-white">Reprovado</h3>
               <p class="text-xs text-gray-500 dark:text-slate-400">Hoje, 10:30 • 5 faltas</p>
             </div>
           </div>
           <span class="font-bold text-gray-400 dark:text-slate-500">65/100</span>
        </div>

        <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 transition-colors p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm">
           <div class="flex items-center gap-4">
             <div class="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 p-2 rounded-xl">
               <mat-icon class="material-icons !leading-none !w-6 !h-6">check_circle</mat-icon>
             </div>
             <div>
               <h3 class="font-semibold text-gray-900 dark:text-white">Aprovado</h3>
               <p class="text-xs text-gray-500 dark:text-slate-400">Ontem, 15:45 • 1 falta</p>
             </div>
           </div>
           <span class="font-bold text-gray-400 dark:text-slate-500">92/100</span>
        </div>
      </div>
      
    </div>
  `
})
export class HistoryComponent {}
