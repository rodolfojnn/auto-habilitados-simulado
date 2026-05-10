import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 font-sans">
      
      <header class="mb-2 text-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ranking Semanal</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Dispute o topo com outros alunos</p>
      </header>

      <div class="bg-emerald-500 rounded-3xl p-6 text-slate-950 text-center shadow-lg mb-2 relative overflow-hidden">
        <!-- Decoration -->
        <mat-icon class="material-icons absolute -right-6 -bottom-6 text-emerald-600/50 !text-8xl">emoji_events</mat-icon>

        <p class="text-slate-900/70 text-[10px] font-bold uppercase tracking-widest mb-1">Sua posição</p>
        <div class="text-4xl font-bold">14º</div>
        <p class="text-slate-900/80 mt-2 text-xs font-semibold">+2 posições desde ontem</p>
      </div>

      <div class="flex flex-col gap-3">
        <!-- Top 3 -->
        <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm relative overflow-hidden transition-all">
           <div class="absolute inset-y-0 left-0 w-1 bg-amber-400"></div>
           <div class="flex items-center gap-4 pl-2">
             <div class="font-bold text-lg text-gray-300 dark:text-slate-600 w-6 text-center">1</div>
             <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
               <mat-icon class="text-gray-400">person</mat-icon>
             </div>
             <div>
               <h3 class="font-semibold text-gray-900 dark:text-white">Ana Souza</h3>
               <p class="text-xs text-brand-600 dark:text-emerald-400 font-bold">99 pts</p>
             </div>
           </div>
        </div>
        
        <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm relative overflow-hidden transition-all">
           <div class="absolute inset-y-0 left-0 w-1 bg-gray-300"></div>
           <div class="flex items-center gap-4 pl-2">
             <div class="font-bold text-lg text-gray-300 dark:text-slate-600 w-6 text-center">2</div>
             <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
               <mat-icon class="text-gray-400">person</mat-icon>
             </div>
             <div>
               <h3 class="font-semibold text-gray-900 dark:text-white">Carlos Lima</h3>
               <p class="text-xs text-brand-600 dark:text-emerald-400 font-bold">95 pts</p>
             </div>
           </div>
        </div>

        <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm relative overflow-hidden transition-all">
           <div class="absolute inset-y-0 left-0 w-1 bg-amber-700"></div>
           <div class="flex items-center gap-4 pl-2">
             <div class="font-bold text-lg text-gray-300 dark:text-slate-600 w-6 text-center">3</div>
             <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
               <mat-icon class="text-gray-400">person</mat-icon>
             </div>
             <div>
               <h3 class="font-semibold text-gray-900 dark:text-white">Mariana Dias</h3>
               <p class="text-xs text-brand-600 dark:text-emerald-400 font-bold">92 pts</p>
             </div>
           </div>
        </div>
      </div>
      
    </div>
  `
})
export class RankingComponent {}
