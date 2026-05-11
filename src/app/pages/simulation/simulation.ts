import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import questionsData from '../../../assets/questions.json';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!isStarted()) {
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-[calc(100dvh-80px)] flex flex-col">

      <!-- Instructions -->
        <div class="flex-grow">
          <h3 class="text-xl font-black text-brand-900 dark:text-white mb-6 px-1">Instruções</h3>

          <ul class="space-y-4">
            <li class="flex items-start gap-4">
              <div class="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">shuffle</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                O simulado contém <strong class="text-brand-900 dark:text-white">30 questões aleatórias</strong>.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">timer</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                A prova teórica tem duração de <strong class="text-brand-900 dark:text-white">40 minutos</strong>.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">menu_book</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                As questões são baseadas no conteúdo oficial do Detran.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">check_circle</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                Para ser aprovado, você deve acertar no mínimo <strong class="text-brand-900 dark:text-white">21 questões</strong>.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">all_inclusive</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                Você pode fazer o simulado quantas vezes quiser.
              </p>
            </li>
          </ul>

          <div class="mt-8 mb-4 text-center">
            <span class="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-5 py-2.5 rounded-2xl text-sm border border-emerald-100 dark:border-emerald-900/30">
              <mat-icon class="material-icons text-[18px] w-[18px] h-[18px] leading-[18px]">emoji_events</mat-icon>
              Boa sorte!
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-auto pt-6 pb-2">
          <button
            (click)="startSimulation()"
            class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Iniciar Simulado</span>
            <mat-icon class="material-icons">arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    } @else {
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center pt-20">
        <mat-icon class="material-icons mb-4 text-brand-400" style="font-size: 48px; width: 48px; height: 48px;">construction</mat-icon>
        <h2 class="text-xl font-bold text-brand-900 dark:text-white mb-2">Simulado em andamento</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-6">A lógica do simulado será implementada em breve.</p>
        <button
          (click)="isStarted.set(false)"
          class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Voltar
        </button>
      </div>
    }
  `
})
export class SimulationComponent implements OnInit {
  isStarted = signal<boolean>(false);

  ngOnInit() {
    console.log('✅ Arquivo questions.json carregado:', questionsData);
  }

  startSimulation() {
    this.isStarted.set(true);
  }
}

