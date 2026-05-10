import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-8 items-center text-center font-sans">
      <div class="mt-12 w-24 h-24 rounded-full flex items-center justify-center bg-brand-50 dark:bg-emerald-500/20 text-brand-500 dark:text-emerald-400">
        <mat-icon class="material-icons !text-5xl !leading-none !w-12 !h-12">directions_car</mat-icon>
      </div>
      
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Simulador de Prova</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm">Esta área estará disponível em breve com a simulação do percurso completo.</p>
      </div>
      
      <button class="bg-gray-900 dark:bg-emerald-500 dark:text-slate-950 text-white font-bold rounded-3xl px-8 py-4 w-full hover:bg-gray-800 dark:hover:bg-emerald-400 transition-colors shadow-lg dark:shadow-emerald-500/10">
        Voltar em breve
      </button>
    </div>
  `
})
export class SimulationComponent {}
