import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, computed, ElementRef, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';
import questionsData from '../../../assets/questions.json';

interface Answer {
  text: string;
  is_correct: boolean;
}

interface Question {
  title: string;
  difficulty: string;
  number: number;
  answers: Answer[];
  explanation?: string;
  sign_code_ref?: string;
}

interface SimulationResult {
  date: string;
  score: number;
  approved: boolean;
}

interface OnboardingAnswers {
  simulations?: SimulationResult[];
  [key: string]: unknown;
}

interface FloatingPoint {
  id: number;
  value: string;
  type: 'positive' | 'negative';
  x: number;
  y: number;
}

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!isStarted() && !isFinished()) {
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-[calc(100dvh-80px)] flex flex-col">
        <!-- Top Card -->
        <div class="bg-brand-600 dark:bg-brand-700 rounded-[2rem] p-6 text-white mb-8 shadow-lg shadow-brand-600/20 relative overflow-hidden">
          <!-- Decoration -->
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-white flex rounded-full opacity-10"></div>
          <div class="absolute right-12 -bottom-10 w-24 h-24 bg-white flex rounded-full opacity-10"></div>
          
          <div class="flex items-center gap-5 relative z-10">
            <div class="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <mat-icon class="material-icons text-white w-8 h-8 text-[32px] leading-[32px]">assignment</mat-icon>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight mb-1">Simulado da Prova</h2>
              <p class="text-white/90 text-sm font-medium">30 questões aleatórias</p>
            </div>
          </div>
        </div>

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
    } @else if (isStarted() && !isFinished()) {
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-[calc(100dvh-80px)] flex flex-col font-sans relative overflow-hidden transition-colors"
        [class.animate-flash-error]="isAnswered() && !isCorrect()"
        [class.animate-flash-success]="isAnswered() && isCorrect()">
        
        <!-- Success Pop Overlay -->
        @if (isCorrectAnim()) {
          <div class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-success-pop">
            <div class="bg-emerald-500 text-white rounded-full p-8 shadow-2xl shadow-emerald-500/50">
              <mat-icon class="material-icons !text-[80px] !w-20 !h-20 !leading-none">check</mat-icon>
            </div>
          </div>
        }

        <!-- Error Pop Overlay -->
        @if (isWrongAnim()) {
          <div class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-error-pop">
            <div class="bg-rose-500 text-white rounded-full p-8 shadow-2xl shadow-rose-500/50">
              <mat-icon class="material-icons !text-[80px] !w-20 !h-20 !leading-none">close</mat-icon>
            </div>
          </div>
        }

        <!-- Game Point Anim Overlay -->
        @for (fp of floatingPoints(); track fp.id) {
          <div 
            class="absolute pointer-events-none z-50 font-black text-2xl animate-float-up"
            [class.text-emerald-500]="fp.type === 'positive'"
            [class.text-rose-500]="fp.type === 'negative'"
            [style.left.px]="fp.x"
            [style.top.px]="fp.y"
          >
            {{ fp.value }}
          </div>
        }

        <!-- Progress & Timer Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex flex-col gap-1 flex-1 pr-8">
            <div class="flex justify-between items-end mb-1">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Questão {{ currentIndex() + 1 }} de {{ totalQuestions }}</span>
              <span class="text-xs font-bold text-brand-600">{{ progress() }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-brand-500 transition-all duration-300" [style.width.%]="progress()"></div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex flex-col items-end shrink-0">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tempo</span>
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl" [class.text-rose-500]="timeLeft() < 300">
                <mat-icon class="material-icons !text-lg !w-[18px] !h-[18px] !leading-none">timer</mat-icon>
                <span class="font-mono font-bold text-sm">{{ formattedTime() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Question Card -->
        <div #questionCard class="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 mb-6 animate-fade-in"
          [class.animate-shake]="isAnswered() && !isCorrect()"
          [class.animate-pulse-success]="isAnswered() && isCorrect()">
          <span class="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            {{ currentQuestion().difficulty }}
          </span>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {{ currentQuestion().title }}
          </h2>
        </div>

        <!-- Answers List -->
        <div class="space-y-3 flex-grow">
          @for (answer of currentQuestion().answers; track $index) {
              <button 
                (click)="selectAnswer(answer, $event)"
                [disabled]="isAnswered()"
              class="w-full p-5 rounded-3xl border-2 text-left transition-all flex items-start gap-4 group relative overflow-hidden"
              [class]="getAnswerClasses(answer)"
            >
              <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm transition-colors"
                [class]="getBadgeClasses(answer)">
                {{ getAlphabetLabel($index) }}
              </div>
              <span class="text-base font-semibold leading-snug pt-0.5 flex-1" [class]="getTextClasses(answer)">
                {{ answer.text }}
              </span>
              
              <!-- Correct/Wrong Icon -->
              @if (isAnswered()) {
                @if (answer.is_correct) {
                  <mat-icon class="material-icons shrink-0 text-emerald-500">check_circle</mat-icon>
                } @else if (selectedAnswer() === answer && !answer.is_correct) {
                  <mat-icon class="material-icons shrink-0 text-rose-500">cancel</mat-icon>
                }
              }
            </button>
          }
        </div>

        <!-- Feedback & Explanation Section -->
        @if (isAnswered()) {
          <div class="mt-6 flex flex-col gap-4 animate-slide-up">
            @if (isCorrect()) {
              <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-5 rounded-3xl flex items-center gap-4">
                <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <mat-icon class="material-icons">emoji_emotions</mat-icon>
                </div>
                <div>
                  <h4 class="font-bold text-emerald-700 dark:text-emerald-400">Resposta Correta!</h4>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400/80">Excelente! Você acertou essa questão.</p>
                </div>
              </div>
            } @else {
              <div class="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-6 rounded-[2rem]">
                <h4 class="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <mat-icon class="material-icons text-brand-500">info</mat-icon>
                  Explicação
                </h4>
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  {{ currentQuestion().explanation || 'A opção marcada em verde é a alternativa correta de acordo com as normas de trânsito.' }}
                </p>
              </div>
            }

            <button 
              (click)="nextQuestion()"
              class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{{ isLastQuestion() ? 'Ver Resultado' : 'Próxima Questão' }}</span>
              <mat-icon class="material-icons">arrow_forward</mat-icon>
            </button>
          </div>
        }
      </div>
    } @else if (isFinished()) {
      <div class="px-6 pt-10 pb-24 max-w-2xl mx-auto min-h-[calc(100dvh-80px)] flex flex-col animate-fade-in font-sans relative overflow-hidden">
        
        <!-- Floating Finish Bonus Anim -->
        @for (fp of floatingPoints(); track fp.id) {
          <div 
            class="absolute pointer-events-none z-50 font-black text-3xl animate-float-up"
            [class.text-emerald-500]="fp.type === 'positive'"
            [style.left.px]="fp.x"
            [style.top.px]="fp.y"
          >
            {{ fp.value }}
          </div>
        }
        <!-- Results Card -->
        <div class="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/5 text-center relative overflow-hidden mb-8">
          <!-- Background Effect -->
          <div class="absolute inset-0 opacity-5 dark:opacity-10">
            <mat-icon class="material-icons absolute -top-10 -left-10 !text-[200px] !w-[200px] !h-[200px]">emoji_events</mat-icon>
          </div>

          <div class="relative z-10">
            <div [class]="(score() >= 21) ? 'w-24 h-24 bg-emerald-500 text-white mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30' : 'w-24 h-24 bg-rose-500 text-white mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30'">
              <mat-icon class="material-icons !text-5xl !w-12 !h-12 !leading-none">{{ (score() >= 21) ? 'emoji_events' : 'sentiment_very_dissatisfied' }}</mat-icon>
            </div>
            
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {{ (score() >= 21) ? 'Parabéns, Motorista!' : 'Quase lá, continue!' }}
            </h2>
            <p class="text-slate-500 dark:text-slate-400 font-medium mb-8">
              {{ (score() >= 21) ? 'Você foi aprovado no simulado!' : 'Infelizmente você não atingiu o score necessário.' }}
            </p>

            <div class="grid grid-cols-3 gap-4 mb-2">
              <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <span class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Acertos</span>
                <span class="text-2xl font-black text-emerald-500">{{ score() }}</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <span class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Erros</span>
                <span class="text-2xl font-black text-rose-500">{{ totalQuestions - score() }}</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <span class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Score</span>
                <span class="text-2xl font-black text-brand-600">{{ Math.round((score() / totalQuestions) * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Details -->
        <div class="space-y-4 mb-10">
          <h3 class="text-xl font-black text-slate-900 dark:text-white px-2">Performance Geral</h3>
          <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-lg shadow-slate-100 dark:shadow-none">
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 bg-brand-50 dark:bg-brand-500/10 text-brand-500 rounded-xl flex items-center justify-center">
                      <mat-icon class="material-icons !text-xl">trending_up</mat-icon>
                   </div>
                   <span class="font-bold text-slate-700 dark:text-slate-200">Simulado Detran</span>
                </div>
                <span [class]="(score() >= 21) ? 'px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full text-xs font-black uppercase' : 'px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 rounded-full text-xs font-black uppercase'">
                   {{ (score() >= 21) ? 'Aprovado' : 'Reprovado' }}
                </span>
             </div>
             <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Você acertou {{ score() }} de {{ totalQuestions }} questões. O mínimo necessário para aprovação na prova real é de 21 acertos (70%).
             </p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            (click)="resetSimulation()"
            class="bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
          >
            <mat-icon class="material-icons">refresh</mat-icon>
            <span>Tentar Novamente</span>
          </button>
          <button 
            (click)="goToHome()"
            class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <mat-icon class="material-icons">home</mat-icon>
            <span>Menu Inicial</span>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-float-up { animation: floatUp 1s ease-out forwards; }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    .animate-pulse-success { animation: pulseSuccess 0.5s ease-out; }
    .animate-flash-error { animation: flashError 0.5s ease-out; }
    .animate-flash-success { animation: flashSuccess 0.5s ease-out; }
    .animate-error-pop { animation: errorPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-success-pop { animation: successPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes floatUp {
      0% { opacity: 0; transform: translateY(0); }
      20% { opacity: 1; transform: translateY(-10px); }
      100% { opacity: 0; transform: translateY(-300px); }
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-4px, 0, 0); }
      20%, 80% { transform: translate3d(6px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-10px, 0, 0); }
      40%, 60% { transform: translate3d(10px, 0, 0); }
    }
    @keyframes pulseSuccess {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 0 30px 15px rgba(16, 185, 129, 0); }
      100% { transform: scale(1); }
    }
    @keyframes flashError {
      0% { background-color: transparent; }
      20% { background-color: rgba(244, 63, 94, 0.3); }
      100% { background-color: transparent; }
    }
    @keyframes flashSuccess {
      0% { background-color: transparent; }
      20% { background-color: rgba(16, 185, 129, 0.3); }
      100% { background-color: transparent; }
    }
    @keyframes errorPop {
      0% { transform: scale(0) rotate(-45deg); opacity: 0; }
      30% { transform: scale(1.2) rotate(0deg); opacity: 1; }
      70% { transform: scale(1) rotate(0deg); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes successPop {
      0% { transform: scale(0) rotate(45deg); opacity: 0; }
      30% { transform: scale(1.2) rotate(0deg); opacity: 1; }
      70% { transform: scale(1) rotate(0deg); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
  `]
})
export class SimulationComponent implements OnInit, OnDestroy {
  readonly totalQuestions = 30;
  readonly Math = Math;

  questionCard = viewChild<ElementRef>('questionCard');

  isStarted = signal<boolean>(false);
  isFinished = signal<boolean>(false);
  
  questions = signal<Question[]>([]);
  currentIndex = signal<number>(0);
  score = signal<number>(0);
  simulationPoints = signal<number>(0);
  
  selectedAnswer = signal<Answer | null>(null);
  isAnswered = signal<boolean>(false);
  isCorrect = signal<boolean>(false);
  isCorrectAnim = signal<boolean>(false);
  isWrongAnim = signal<boolean>(false);
  
  floatingPoints = signal<FloatingPoint[]>([]);
  private nextFpId = 0;
  
  timeLeft = signal<number>(2400); // 40 minutes
  private timerSubscription?: Subscription;

  progress = computed(() => {
    return Math.round(((this.currentIndex()) / this.totalQuestions) * 100);
  });

  currentQuestion = computed(() => {
    return this.questions()[this.currentIndex()];
  });

  formattedTime = computed(() => {
    const mins = Math.floor(this.timeLeft() / 60);
    const secs = this.timeLeft() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  ngOnInit() {
    this.prepareQuestions();
    const currentGlobalPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
    this.simulationPoints.set(currentGlobalPoints);
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  prepareQuestions() {
    const allQuestions: Question[] = [];
    const data = questionsData as { modules: Record<string, { questions: Question[] }> };
    
    if (data && data.modules) {
      Object.values(data.modules).forEach(module => {
        if (module && module.questions) {
          allQuestions.push(...module.questions);
        }
      });
    }

    // Shuffle and pick 30
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    this.questions.set(shuffled.slice(0, this.totalQuestions));
  }

  startSimulation() {
    this.isStarted.set(true);
    this.startTimer();
  }

  startTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.finishSimulation();
      }
    });
  }

  selectAnswer(answer: Answer, event: MouseEvent) {
    if (this.isAnswered()) return;
    
    this.selectedAnswer.set(answer);
    this.isAnswered.set(true);
    
    const currentPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
    
    if (answer.is_correct) {
      this.score.update(s => s + 1);
      this.isCorrect.set(true);
      this.isCorrectAnim.set(true);
      setTimeout(() => this.isCorrectAnim.set(false), 800);
      
      const newPoints = currentPoints + 1;
      localStorage.setItem('user_points', newPoints.toString());
      this.simulationPoints.set(newPoints);
      this.showPointsAnim('+1', 'positive', event.clientX, event.clientY);
    } else {
      this.isCorrect.set(false);
      this.isWrongAnim.set(true);
      setTimeout(() => this.isWrongAnim.set(false), 800);
      
      const newPoints = Math.max(0, currentPoints - 3);
      localStorage.setItem('user_points', newPoints.toString());
      this.simulationPoints.set(newPoints);
      this.showPointsAnim('-3', 'negative', event.clientX, event.clientY);
      this.triggerVibration();
    }

    // Dispatch global event for App component to sync
    window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: this.simulationPoints() }));
  }

  private showPointsAnim(value: string, type: 'positive' | 'negative', x: number, y: number) {
    const id = this.nextFpId++;
    const newFp: FloatingPoint = { id, value, type, x, y };
    
    this.floatingPoints.update(list => [...list, newFp]);
    
    setTimeout(() => {
      this.floatingPoints.update(list => list.filter(f => f.id !== id));
    }, 1000);
  }

  private triggerVibration() {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }

  nextQuestion() {
    if (this.currentIndex() < this.totalQuestions - 1) {
      this.currentIndex.update(i => i + 1);
      this.isAnswered.set(false);
      this.selectedAnswer.set(null);
    } else {
      this.finishSimulation();
    }
  }

  finishSimulation() {
    this.timerSubscription?.unsubscribe();
    this.isFinished.set(true);
    this.saveSimulationResult();
    
    // Final bonus animation
    setTimeout(() => {
      this.showPointsAnim('+5', 'positive', window.innerWidth / 2, window.innerHeight / 2);
    }, 500);
  }

  saveSimulationResult() {
    const data = localStorage.getItem('onboarding_answers') || '{}';
    try {
      const answers = JSON.parse(data) as OnboardingAnswers;
      const simulations = answers.simulations || [];
      simulations.push({
        date: new Date().toISOString(),
        score: this.score(),
        approved: this.score() >= 21
      });
      answers.simulations = simulations;
      
      // Completion bonus: +5 points
      const currentPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
      const newPoints = currentPoints + 5;
      localStorage.setItem('user_points', newPoints.toString());
      this.simulationPoints.set(newPoints);
      
      localStorage.setItem('onboarding_answers', JSON.stringify(answers));
      window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: newPoints }));
    } catch (e) {
      console.error('Error saving simulation result', e);
    }
  }

  resetSimulation() {
    this.isStarted.set(false);
    this.isFinished.set(false);
    this.currentIndex.set(0);
    this.score.set(0);
    this.timeLeft.set(2400);
    this.isAnswered.set(false);
    this.selectedAnswer.set(null);
    this.prepareQuestions();
    
    const currentGlobalPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
    this.simulationPoints.set(currentGlobalPoints);
  }

  goToHome() {
    window.location.href = '/';
  }

  isLastQuestion() {
    return this.currentIndex() === this.totalQuestions - 1;
  }

  getAlphabetLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getAnswerClasses(answer: Answer): string {
    if (!this.isAnswered()) {
      return 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-500/10 text-slate-700 dark:text-slate-300';
    }
    
    if (answer.is_correct) {
      return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    }
    
    if (this.selectedAnswer() === answer && !answer.is_correct) {
      return 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400';
    }
    
    return 'border-slate-100 dark:border-white/5 opacity-50 bg-white dark:bg-slate-800 text-slate-400';
  }

  getBadgeClasses(answer: Answer): string {
    if (!this.isAnswered()) {
      return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-brand-500 group-hover:text-white';
    }
    
    if (answer.is_correct) {
      return 'bg-emerald-500 text-white';
    }
    
    if (this.selectedAnswer() === answer && !answer.is_correct) {
      return 'bg-rose-500 text-white';
    }
    
    return 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600';
  }

  getTextClasses(answer: Answer): string {
    if (!this.isAnswered()) return 'text-slate-700 dark:text-slate-300';
    if (answer.is_correct) return 'text-emerald-800 dark:text-emerald-300';
    if (this.selectedAnswer() === answer && !answer.is_correct) return 'text-rose-800 dark:text-rose-300';
    return 'text-slate-400 dark:text-slate-600';
  }
}
