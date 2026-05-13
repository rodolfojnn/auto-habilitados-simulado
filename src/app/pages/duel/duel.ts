import { Component, ChangeDetectionStrategy, signal, OnInit, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LeadCaptureComponent } from '../../components/lead-capture/lead-capture';

interface Answer {
  text: string;
  label: string;
  isCorrect?: boolean;
  isSelected?: boolean;
}

@Component({
  selector: 'app-duel',
  standalone: true,
  imports: [MatIconModule, LeadCaptureComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[calc(100dvh-80px)] md:min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      @if (!leadCaptured()) {
        <app-lead-capture
          title="Duelo Multiplayer"
          description="Para entrar na arena de duelos e competir contra outros alunos na sua região, precisamos de algumas informações rápidas."
          icon="sports_esports"
          iconBgClass="bg-indigo-50 dark:bg-indigo-500/20"
          iconTextClass="text-indigo-600 dark:text-indigo-400"
          (captured)="onLeadCaptured()">
        </app-lead-capture>
      } @else if (!isStarted()) {
        <!-- Home State within Duel -->
        <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-[calc(100dvh-80px)] flex flex-col pt-10">
          <!-- Top Card -->
          <div class="bg-indigo-600 dark:bg-indigo-700 rounded-[2rem] p-6 text-white mb-8 shadow-lg shadow-indigo-600/20 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-white flex rounded-full opacity-10"></div>
            <div class="absolute right-12 -bottom-10 w-24 h-24 bg-white flex rounded-full opacity-10"></div>

            <div class="flex items-center gap-5 relative z-10">
              <div class="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <mat-icon class="material-icons text-white w-8 h-8 text-[32px] leading-[32px]">sports_esports</mat-icon>
              </div>
              <div>
                <h2 class="text-2xl font-black tracking-tight mb-1">Duelo Ao Vivo</h2>
                <p class="text-white/90 text-sm font-medium">Batalha de conhecimento 1v1</p>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="flex-grow">
            <h3 class="text-xl font-black text-brand-600 dark:text-brand-400 mb-6 px-1">Como funciona?</h3>
            <ul class="space-y-4">
              @for (item of instructions; track item.icon) {
                <li class="flex items-start gap-4">
                  <div class="p-2.5 rounded-xl mt-0.5 shrink-0" [class]="item.bg + ' ' + item.text">
                    <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">{{ item.icon }}</mat-icon>
                  </div>
                  <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5" [innerHTML]="item.label">
                  </p>
                </li>
              }
            </ul>
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
      } @else if (isSearching()) {
        <!-- Searching State -->
        <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center pt-32">
          <div class="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-8 relative">
            <div class="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-radar-ping"></div>
            <div class="absolute inset-0 rounded-full border-2 border-indigo-400/50 animate-radar-ping-slow"></div>
            <mat-icon class="material-icons text-indigo-500 dark:text-indigo-400" style="font-size: 48px; width: 48px; height: 48px;">radar</mat-icon>
          </div>
          <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4">Buscando oponente...</h2>
          <p class="text-slate-500 dark:text-slate-400 mb-12 max-w-md font-medium leading-relaxed">Prepare-se para o duelo! Você será conectado em breve com um motorista do mesmo nível.</p>

          <div class="flex gap-3 mb-10">
            <div class="w-3 h-3 rounded-full bg-indigo-500 animate-bounce"></div>
            <div class="w-3 h-3 rounded-full bg-indigo-500 animate-bounce [animation-delay:200ms]"></div>
            <div class="w-3 h-3 rounded-full bg-indigo-500 animate-bounce [animation-delay:400ms]"></div>
          </div>
          
          <button (click)="cancelSearch()" class="text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">Cancelar Busca</button>
        </div>
      } @else {
        <!-- Live Duel Game State -->
        <div class="flex flex-col h-[calc(100dvh-80px)] md:h-screen max-w-2xl mx-auto overflow-hidden">
          <!-- Header (Compact with Timer) -->
          <header class="flex items-center justify-between px-6 py-2.5 shrink-0 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#020617]">
            <button (click)="cancelSearch()" class="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <mat-icon class="text-slate-600 dark:text-white !text-lg">chevron_left</mat-icon>
            </button>
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-1.5 mb-0.5">
                <mat-icon class="text-indigo-600 dark:text-indigo-400 !text-sm !w-4 !h-4">schedule</mat-icon>
                <span class="text-base font-black tabular-nums tracking-tight text-slate-900 dark:text-white">01:42</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">AO VIVO</span>
              </div>
            </div>
            <button (click)="cancelSearch()" class="h-9 px-4 flex items-center justify-center bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
              Sair
            </button>
          </header>

          <div class="flex-1 flex flex-col px-5 pt-2 pb-4 overflow-hidden">
            <!-- Question Progress -->
            <div class="mb-3 shrink-0">
              <div class="text-center mb-1">
                <span class="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">QUESTÃO 4 DE 10</span>
              </div>
              <div class="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
                <div class="h-full bg-gradient-to-r from-indigo-600 to-purple-600 w-[40%] transition-all duration-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
              </div>
            </div>

            <!-- Question Text -->
            <div class="text-center mb-4 shrink-0">
              <h2 class="text-lg font-black leading-tight text-slate-900 dark:text-white px-2">Qual é a capital do Brasil?</h2>
            </div>

            <!-- Answers -->
            <div class="space-y-2 mb-4 flex-grow overflow-y-auto pr-1">
              @for (answer of answers; track answer.label) {
                <button
                  (click)="selectAnswer(answer)"
                  class="w-full group relative flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 overflow-hidden"
                  [class]="getAnswerBorderClass(answer)"
                >
                  <div class="w-7 h-7 flex items-center justify-center rounded-lg font-black text-xs transition-colors shrink-0"
                    [class]="getAnswerLabelClass(answer)">
                    {{ answer.label }}
                  </div>
                  <span class="text-sm font-bold flex-1 text-left" [class]="getAnswerTextClass(answer)">
                    {{ answer.text }}
                  </span>
                  @if (hasAnswered()) {
                    @if (answer.isCorrect) {
                      <mat-icon class="text-emerald-500 !text-xl animate-bounce-short">check_circle</mat-icon>
                    } @else if (answer.isSelected) {
                      <mat-icon class="text-rose-500 !text-xl animate-bounce-short">cancel</mat-icon>
                    }
                  }
                </button>
              }
            </div>

            <!-- Interactive Summary Trigger -->
            <div 
              (click)="toggleStats()"
              (keydown.enter)="toggleStats()"
              tabindex="0"
              class="w-full mt-auto mb-2 p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 active:scale-[0.98] transition-all cursor-pointer select-none group"
            >
              <div class="flex items-center justify-between">
                <!-- Player You -->
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full border-2 border-blue-500/30 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center relative">
                    <span class="text-sm font-black text-blue-600 dark:text-blue-400">VU</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Você</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white">1.240 pts</span>
                  </div>
                </div>

                <!-- VS Badge -->
                <div class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span class="font-black text-xs italic text-slate-400 dark:text-slate-500">VS</span>
                </div>

                <!-- Rival -->
                <div class="flex items-center gap-3">
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rival</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white">1.080 pts</span>
                  </div>
                  <div class="w-12 h-12 rounded-full border-2 border-purple-500/30 dark:border-purple-500/50 bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center relative">
                    <span class="text-sm font-black text-purple-600 dark:text-purple-400">RI</span>
                  </div>
                </div>
              </div>
              <div class="mt-3 flex justify-center">
                 <div class="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                   Ver detalhes da partida
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Sheet Drawer (Stats) -->
        <div 
          class="fixed inset-0 z-50 transition-all duration-300 ease-out flex flex-col justify-end"
          [class.pointer-events-none]="!showStats()"
          [class.bg-slate-950/60]="showStats()"
        >
          <div (click)="toggleStats()" (keydown.enter)="toggleStats()" tabindex="0" class="absolute inset-0"></div>
          
          <div 
            class="w-full max-w-lg mx-auto bg-slate-900 border-t-2 border-slate-800 rounded-t-[2.5rem] p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative transition-transform duration-300 ease-out"
            [class.translate-y-full]="!showStats()"
            [class.translate-y-0]="showStats()"
          >
            <!-- Handle -->
            <div class="absolute left-1/2 -top-3 -translate-x-1/2 w-16 h-1.5 bg-slate-700/50 rounded-full"></div>

            <div class="text-center mb-6 pt-2">
              <h3 class="text-xl font-black text-white uppercase italic tracking-wide">Placar da Partida</h3>
            </div>

            <!-- Stats Container -->
            <div class="bg-slate-800/50 rounded-3xl border border-slate-700/50 mb-6 overflow-hidden shadow-inner">
              
              <!-- Main Score (Points) -->
              <div class="flex justify-between items-center p-5 border-b border-slate-700/50 relative bg-slate-800/30">
                <div class="absolute top-0 bottom-0 left-1/2 w-px bg-slate-700/50 -translate-x-1/2"></div>
                
                <!-- You -->
                <div class="flex-1 text-center">
                   <div class="w-12 h-12 mx-auto rounded-full border-2 border-blue-500/50 bg-blue-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                     <span class="text-sm font-black text-blue-400">VU</span>
                   </div>
                   <div class="text-3xl font-black text-white tabular-nums">1.240</div>
                   <div class="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Você</div>
                </div>

                <!-- Center -->
                <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner relative z-10 shrink-0">
                   <span class="text-sm font-black italic text-slate-400">VS</span>
                </div>

                <!-- Rival -->
                <div class="flex-1 text-center">
                   <div class="w-12 h-12 mx-auto rounded-full border-2 border-purple-500/50 bg-purple-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                     <span class="text-sm font-black text-purple-400">RI</span>
                   </div>
                   <div class="text-3xl font-black text-white tabular-nums">1.080</div>
                   <div class="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-1">Rival</div>
                </div>
              </div>

              <!-- Detailed Stats -->
              <div class="py-3 px-1">
                <!-- Questão -->
                <div class="flex items-center justify-between py-2 relative group hover:bg-slate-800/40 transition-colors">
                  <div class="text-xl font-black text-blue-400 tabular-nums text-center w-1/3">4<span class="text-xs text-blue-400/50">/10</span></div>
                  <div class="w-1/3 flex justify-center relative z-10">
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center bg-slate-900 border border-slate-700/50 rounded-lg py-1 px-3 shadow-md">Questão</div>
                  </div>
                  <div class="text-xl font-black text-purple-400 tabular-nums text-center w-1/3">3<span class="text-xs text-purple-400/50">/10</span></div>
                </div>
                
                <!-- Acertos -->
                <div class="flex items-center justify-between py-2 relative group hover:bg-slate-800/40 transition-colors">
                  <div class="text-xl font-black text-emerald-400 tabular-nums text-center w-1/3">04</div>
                  <div class="w-1/3 flex justify-center relative z-10">
                    <div class="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest text-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1 px-3 shadow-md">Acertos</div>
                  </div>
                  <div class="text-xl font-black text-emerald-400 tabular-nums text-center w-1/3">02</div>
                </div>

                <!-- Erros -->
                <div class="flex items-center justify-between py-2 relative group hover:bg-slate-800/40 transition-colors">
                  <div class="text-xl font-black text-rose-400 tabular-nums text-center w-1/3">00</div>
                  <div class="w-1/3 flex justify-center relative z-10">
                    <div class="text-[9px] font-black text-rose-500/80 uppercase tracking-widest text-center bg-rose-500/10 border border-rose-500/20 rounded-lg py-1 px-3 shadow-md">Erros</div>
                  </div>
                  <div class="text-xl font-black text-rose-400 tabular-nums text-center w-1/3">01</div>
                </div>
              </div>
            </div>

            <button 
              (click)="toggleStats()"
              class="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 block"
            >
              Continuar Duelo
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    @keyframes radar-ping {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    
    @keyframes radar-ping-slow {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes bounce-short {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    
    .animate-radar-ping { animation: radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .animate-radar-ping-slow { animation: radar-ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .animate-bounce-short { animation: bounce-short 0.5s ease-in-out infinite; }
  `]
})
export class DuelComponent implements OnInit {
  isStarted = signal<boolean>(false);
  isSearching = signal<boolean>(false);
  leadCaptured = signal<boolean>(false);
  showStats = signal<boolean>(false);

  instructions = [
    { icon: 'shuffle', label: 'Você será conectado com um <strong class="text-brand-900 dark:text-white">jogador aleatório</strong>.', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    { icon: 'format_list_numbered', label: 'O duelo contém <strong class="text-brand-900 dark:text-white">10 questões</strong> de múltipla escolha.', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
    { icon: 'timer', label: 'Respostas <strong class="text-brand-900 dark:text-white">mais rápidas</strong> garantem mais pontos.', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    { icon: 'check_circle', label: 'Vence quem tiver o melhor <strong class="text-brand-900 dark:text-white">equilíbrio</strong> de acertos e tempo!', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' }
  ];

  answers: Answer[] = [
    { label: 'A', text: 'São Paulo', isSelected: false },
    { label: 'B', text: 'Brasília', isSelected: true, isCorrect: true },
    { label: 'C', text: 'Rio de Janeiro', isSelected: false },
    { label: 'D', text: 'Belo Horizonte', isSelected: false }
  ];

  hasAnswered = computed(() => this.answers.some(a => a.isSelected));

  ngOnInit() {
    this.checkLeadStatus();
  }

  toggleStats() {
    this.showStats.update(v => !v);
  }

  getAnswerTextClass(answer: Answer): string {
    if (!this.hasAnswered()) {
      return 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white';
    }
    if (answer.isCorrect) {
      return 'text-emerald-700 dark:text-emerald-400';
    }
    if (answer.isSelected && !answer.isCorrect) {
      return 'text-rose-700 dark:text-rose-400';
    }
    return 'text-slate-400 dark:text-slate-600 opacity-50';
  }

  selectAnswer(answer: Answer) {
    // Only allow one selection
    if (this.hasAnswered()) return;
    
    // Find answer in array and mark as selected
    const index = this.answers.indexOf(answer);
    if (index !== -1) {
      const updatedAnswers = [...this.answers];
      updatedAnswers[index] = { ...answer, isSelected: true };
      this.answers = updatedAnswers;
    }
  }

  onLeadCaptured() {
    this.leadCaptured.set(true);
    // Persist status
    const data = JSON.parse(localStorage.getItem('onboarding_answers') || '{}');
    data.lead_captured = true;
    localStorage.setItem('onboarding_answers', JSON.stringify(data));
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
    this.isSearching.set(true);
    
    // Simulate finding an opponent after 3 seconds
    setTimeout(() => {
      this.isSearching.set(false);
    }, 3000);
  }

  cancelSearch() {
    this.isStarted.set(false);
    this.isSearching.set(false);
    this.showStats.set(false);
  }

  getAnswerBorderClass(answer: Answer): string {
    if (answer.isSelected) {
      return answer.isCorrect 
        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5' 
        : 'border-rose-500 bg-rose-50 dark:bg-rose-500/5';
    }
    return 'border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-white/20';
  }

  getAnswerLabelClass(answer: Answer): string {
    if (answer.isSelected) {
      return answer.isCorrect 
        ? 'bg-emerald-500 text-white' 
        : 'bg-rose-500 text-white';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-purple-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700';
  }
}