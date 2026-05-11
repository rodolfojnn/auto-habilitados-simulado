import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LeadCaptureComponent } from '../../components/lead-capture/lead-capture';

@Component({
  selector: 'app-duel',
  standalone: true,
  imports: [MatIconModule, LeadCaptureComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!leadCaptured()) {
      <app-lead-capture
        title="Duelo Multiplayer"
        description="Para entrar na arena de duelos e competir contra outros alunos na sua região, precisamos de algumas informações rápidas."
        icon="sports_esports"
        iconBgClass="bg-indigo-50 dark:bg-indigo-500/20"
        iconTextClass="text-indigo-600 dark:text-indigo-400"
        (captured)="leadCaptured.set(true)">
      </app-lead-capture>
    } @else {
      @if (!isStarted()) {
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-[calc(100dvh-80px)] flex flex-col">
        <!-- Top Card -->
        <div class="bg-indigo-600 dark:bg-indigo-700 rounded-[2rem] p-6 text-white mb-8 shadow-lg shadow-indigo-600/20 relative overflow-hidden">
          <!-- Decoration -->
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-white flex rounded-full opacity-10"></div>
          <div class="absolute right-12 -bottom-10 w-24 h-24 bg-white flex rounded-full opacity-10"></div>

          <div class="flex items-center gap-5 relative z-10">
            <div class="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <mat-icon class="material-icons text-white w-8 h-8 text-[32px] leading-[32px]">sports_esports</mat-icon>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight mb-1">Duelo</h2>
              <p class="text-white/90 text-sm font-medium">Batalha de conhecimento 1v1</p>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="flex-grow">
          <h3 class="text-xl font-black text-brand-900 dark:text-white mb-6 px-1">Como funciona?</h3>

          <ul class="space-y-4">
            <li class="flex items-start gap-4">
              <div class="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">group</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                Você será conectado com um jogador aleatório.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-brand-100 dark:bg-brand-900/30 p-2.5 rounded-xl text-brand-600 dark:text-brand-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">format_list_numbered</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                O duelo contém <strong class="text-brand-900 dark:text-white">10 questões</strong> de múltipla escolha.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">timer</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                Corra contra o relógio! Respostas mais rápidas garantem mais pontos.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">balance</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                Vence quem tiver o melhor equilíbrio entre <strong class="text-brand-900 dark:text-white">acertos e tempo</strong>!
              </p>
            </li>
          </ul>

          <div class="mt-8 mb-4 text-center">
            <span class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-5 py-2.5 rounded-2xl text-sm border border-indigo-100 dark:border-indigo-900/30">
              <mat-icon class="material-icons text-[18px] w-[18px] h-[18px] leading-[18px]">sports_martial_arts</mat-icon>
              Prepare-se para a batalha!
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-auto pt-6 pb-2">
          <button
            (click)="startDuel()"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Procurar Oponente</span>
            <mat-icon class="material-icons">search</mat-icon>
          </button>
        </div>
      </div>
    } @else {
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center pt-20">
        <div class="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6 relative">
          <div class="absolute inset-0 rounded-full border-4 border-indigo-400/30 animate-[ping_2s_infinite]"></div>
          <mat-icon class="material-icons text-indigo-600 dark:text-indigo-400" style="font-size: 40px; width: 40px; height: 40px;">radar</mat-icon>
        </div>
        <h2 class="text-2xl font-black text-brand-900 dark:text-white mb-3">Buscando oponente...</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-10 font-medium">Você será conectado em breve com um jogador aleatório. O desenvolvimento do backend com Firebase acontecerá nos próximos passos!</p>

        <!-- Animated loader -->
        <div class="flex gap-2 mb-10">
          <div class="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-[bounce_1s_infinite]"></div>
          <div class="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-[bounce_1s_infinite_200ms]"></div>
          <div class="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-[bounce_1s_infinite_400ms]"></div>
        </div>

      </div>
      }
    }
  `
})
export class DuelComponent implements OnInit {
  isStarted = signal<boolean>(false);
  leadCaptured = signal<boolean>(false);

  ngOnInit() {
    this.checkLeadStatus();
  }

  checkLeadStatus() {
    const data = localStorage.getItem('onboarding_answers');
    if (data) {
      try {
        const answers = JSON.parse(data) as Record<string, unknown>;
        if (answers && answers['lead_captured'] === true) {
          this.leadCaptured.set(true);
        }
      } catch {
        // ignore parse error
      }
    }
  }

  startDuel() {
    this.isStarted.set(true);
  }
}
