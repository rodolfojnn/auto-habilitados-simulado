import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, computed, ElementRef, viewChild, isDevMode } from '@angular/core';
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
  moduleTitle?: string;
}

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
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-full flex flex-col">
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
              <div class="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">menu_book</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                As questões são baseadas no conteúdo oficial do Senatran.
              </p>
            </li>

            <li class="flex items-start gap-4">
              <div class="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                <mat-icon class="material-icons text-xl w-5 h-5 leading-[20px]">check_circle</mat-icon>
              </div>
              <p class="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                Para ser aprovado, você deve acertar no mínimo <strong class="text-brand-900 dark:text-white">20 questões</strong>.
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
      <div class="px-5 pt-6 pb-24 max-w-2xl mx-auto min-h-full flex flex-col font-sans relative overflow-hidden transition-colors"
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

        <!-- Game Point Anim Overlay Removed from here -->

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
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
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
          <div class="flex items-center justify-between mb-4">
            <span class="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {{ currentQuestion().difficulty }}
            </span>
            @if (currentQuestion().moduleTitle) {
              <span class="inline-block px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/20 text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {{ currentQuestion().moduleTitle }}
              </span>
            }
          </div>

          @if (currentQuestion().sign_code_ref) {
            <div class="mb-6 flex justify-center">
              <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-white/5 mx-auto w-32 h-32 md:w-40 md:h-40 shadow-inner relative overflow-hidden group flex items-center justify-center">
                <div class="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  [src]="'assets/placas/' + currentQuestion().sign_code_ref + '.svg'"
                  [alt]="'Placa ' + currentQuestion().sign_code_ref"
                  class="w-full h-full object-contain drop-shadow-md"
                  (error)="handleImageError($event)"
                />
              </div>
            </div>
          }

          <h2 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {{ currentQuestion().title }}
          </h2>
        </div>

        <!-- Answers List -->
        <div class="space-y-3 flex-grow">
          @for (answer of currentQuestion().answers; track currentIndex() + '-' + $index) {
              <button
                (click)="selectAnswer(answer)"
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

              <button
                (click)="nextQuestion()"
                class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{{ isLastQuestion() ? 'Ver Resultado' : 'Próxima Questão' }}</span>
                <mat-icon class="material-icons">arrow_forward</mat-icon>
              </button>
            }
          </div>
        }
      </div>
    } @else if (isFinished()) {
      <div class="px-5 pt-8 pb-24 max-w-[420px] mx-auto min-h-full flex flex-col animate-fade-in font-sans relative overflow-hidden">

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

        @if (score() < 20) {
          <!-- FAILED STATE -->
          <div class="flex flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
            <div class="flex-1">
              <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-3">
                Você foi<br/>
                <span class="text-rose-500">reprovado!</span>
              </h2>
              <p class="text-slate-500 dark:text-slate-400 font-medium text-base sm:text-lg leading-snug">
                Estude mais e a<br class="block sm:hidden"/> aprovação virá!
              </p>
            </div>

            <div class="shrink-0 w-[38vw] max-w-[150px] flex items-center justify-end">
              <img src="assets/sad-emoji-2.png" alt="Não aprovado" class="w-full h-auto object-contain drop-shadow-2xl" referrerpolicy="no-referrer" />
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-[28px] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border
            border-slate-100 dark:border-white/5 flex items-center gap-4 sm:gap-6 mb-4">
            <!-- Left Side: Donut Chart -->
            <div class="relative shrink-0 w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] flex items-center justify-center">
              <svg viewBox="0 0 36 36" class="absolute inset-0 w-full h-full transform -rotate-90">
                <path
                  class="text-slate-100 dark:text-slate-700/50"
                  stroke-width="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="text-rose-500 transition-all duration-1000 ease-out"
                  [attr.stroke-dasharray]="Math.round((score() / totalQuestions) * 100) + ', 100'"
                  stroke-linecap="round"
                  stroke-width="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="text-center z-10 flex flex-col items-center justify-center pt-1">
                <div class="text-[22px] sm:text-[26px] font-black text-rose-500 leading-none tracking-tighter">{{ Math.round((score() / totalQuestions) * 100) }}%</div>
                <div class="text-[8px] sm:text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">de acertos</div>
              </div>
            </div>

            <!-- Vertical Divider -->
            <div class="w-px h-[70px] sm:h-[100px] shrink-0 bg-slate-100 dark:bg-slate-700/50"></div>

            <!-- Right Side: Stats list -->
            <div class="flex flex-col flex-1 gap-2 min-w-0 justify-center">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <mat-icon class="material-icons !text-[14px] sm:!text-[16px] !w-[14px] sm:!w-[16px] !h-[14px] sm:!h-[16px] !leading-none">my_location</mat-icon>
                  </div>
                  <span class="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">Acertos</span>
                </div>
                <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white shrink-0">{{ score() }}</span>
              </div>

              <div class="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>

              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <mat-icon class="material-icons !text-[14px] sm:!text-[16px] !w-[14px] sm:!w-[16px] !h-[14px] sm:!h-[16px] !leading-none">close</mat-icon>
                  </div>
                  <span class="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">Erros</span>
                </div>
                <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white shrink-0">{{ totalQuestions - score() }}</span>
              </div>

            </div>
          </div>

          <!-- Upsell CTA -->
          <a
            href="https://teorico.dirigiragora.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            class="block relative bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-[0.98] transition-all rounded-[24px]
            p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border-2 border-rose-500 mb-4 group no-underline"
          >
            <!-- Badge "Destaque" -->
            <div class="absolute top-0 right-6 bg-rose-500 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-b-xl">
              Destaque
            </div>

            <div class="flex items-center gap-4 mt-2">
              <div class="w-[48px] h-[48px] rounded-[10px] bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                <mat-icon class="material-icons !text-[36px] !w-[36px] !h-[36px] !leading-none">school</mat-icon>
              </div>
              <div class="flex-1 min-w-0 pr-1">
                <h3 class="text-[15px] font-black text-slate-900 dark:text-white leading-[1.2] mb-1.5 tracking-tight">
                  Garanta sua aprovação!
                </h3>
                <p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug">
                  Aulas ao vivo com interação real entre alunos e instrutor. 98% de aprovação. Clique e conheça!
                </p>
              </div>
              <div class="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <mat-icon class="material-icons !text-[24px] !w-[24px] !h-[24px] !leading-none">chevron_right</mat-icon>
              </div>
            </div>
          </a>

        } @else {
          <!-- PASSED STATE -->
          <!-- Results Card -->
          <div class="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/5 text-center relative overflow-hidden mb-8">
            <!-- Background Effect -->
            <div class="absolute inset-0 opacity-5 dark:opacity-10">
              <mat-icon class="material-icons absolute -top-10 -left-10 !text-[200px] !w-[200px] !h-[200px]">emoji_events</mat-icon>
            </div>

            <div class="relative z-10">
              <div class="w-24 h-24 bg-emerald-500 text-white mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <mat-icon class="material-icons !text-5xl !w-12 !h-12 !leading-none">emoji_events</mat-icon>
              </div>

              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
                Parabéns, Motorista!
              </h2>
              <p class="text-slate-500 dark:text-slate-400 font-medium mb-8">
                Você foi aprovado no simulado!
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
                  <span class="text-2xl font-black text-emerald-600">{{ Math.round((score() / totalQuestions) * 100) }}%</span>
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
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full text-xs font-black uppercase">
                     Aprovado
                  </span>
               </div>
               <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Você acertou {{ score() }} de {{ totalQuestions }} questões. O mínimo necessário para aprovação na prova real é de 20 acertos (66%).
               </p>
            </div>
          </div>
        }

        <!-- Buttons -->
        <div class="mt-3 grid grid-cols-2 gap-3">
          <button
            (click)="resetSimulation()"
            class="border-2 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-sm active:scale-[0.98]"
          >
            <mat-icon class="material-icons !text-[18px] !w-[18px] !h-[18px] !leading-none">refresh</mat-icon>
            <span>Refazer</span>
          </button>
          <button
            (click)="goToHome()"
            class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-sm active:scale-[0.98]"
          >
            <mat-icon class="material-icons !text-[18px] !w-[18px] !h-[18px] !leading-none">home</mat-icon>
            <span>Menu Inicial</span>
          </button>
        </div>
      </div>
    }

    <!-- Game Point Anim Overlay Fixed Global -->
    @for (fp of floatingPoints(); track fp.id) {
      <div
        class="fixed pointer-events-none z-[9999] font-black text-2xl animate-float-up"
        [class.text-emerald-500]="fp.type === 'positive'"
        [class.text-rose-500]="fp.type === 'negative'"
        style="-webkit-text-stroke: 1px white;"
        [style.left.px]="fp.x"
        [style.top.px]="fp.y"
      >
        {{ fp.value }}
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

  timeElapsed = signal<number>(0);
  private timerSubscription?: Subscription;

  modulePerformance = signal<Record<string, ModulePerformance>>({});

  progress = computed(() => {
    const answeredOffset = this.isAnswered() ? 1 : 0;
    return Math.round(((this.currentIndex() + answeredOffset) / this.totalQuestions) * 100);
  });

  currentQuestion = computed(() => {
    return this.questions()[this.currentIndex()];
  });

  formattedTime = computed(() => {
    const mins = Math.floor(this.timeElapsed() / 60);
    const secs = this.timeElapsed() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  ngOnInit() {

    if (isDevMode()) {
      // Debug mode: mostra a tela de resultado final para editar o layout
      this.prepareQuestions();
      this.isStarted.set(true);
      this.isFinished.set(true);
      this.score.set(19); // Altere para testar layout aprovado (>=20) ou reprovado (<20)
      this.modulePerformance.set({
        'Legislação de Trânsito': { correct: 10, incorrect: 2 },
        'Sinalização': { correct: 8, incorrect: 1 },
        'Direção Defensiva': { correct: 7, incorrect: 2 },
      });
      return;
    }

    this.prepareQuestions();
    const currentGlobalPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
    this.simulationPoints.set(currentGlobalPoints);
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  prepareQuestions() {
    const allQuestions: Question[] = [];
    const data = questionsData as { modules: Record<string, { title: string, questions: Question[] }> };

    if (data && data.modules) {
      Object.values(data.modules).forEach(module => {
        if (module && module.questions) {
          module.questions.forEach(q => {
            q.moduleTitle = module.title;
          });
          allQuestions.push(...module.questions);
        }
      });
    }

    const difficultyScore = (d: string) => {
      const lower = d?.toLowerCase() || '';
      if (lower.includes('dif')) return 3;
      if (lower.includes('interm') || lower.includes('médio')) return 2;
      return 1;
    };

    const hard = allQuestions.filter(q => difficultyScore(q.difficulty) === 3).sort(() => 0.5 - Math.random());
    const medium = allQuestions.filter(q => difficultyScore(q.difficulty) === 2).sort(() => 0.5 - Math.random());
    const easy = allQuestions.filter(q => difficultyScore(q.difficulty) === 1).sort(() => 0.5 - Math.random());

    const numHard = Math.round(this.totalQuestions * 0.70);
    const numMedium = Math.round(this.totalQuestions * 0.20);
    const numEasy = this.totalQuestions - numHard - numMedium;

    let selected = [
      ...hard.slice(0, numHard),
      ...medium.slice(0, numMedium),
      ...easy.slice(0, numEasy)
    ];

    if (selected.length < this.totalQuestions) {
      const remaining = [
        ...hard.slice(numHard),
        ...medium.slice(numMedium),
        ...easy.slice(numEasy)
      ].sort(() => 0.5 - Math.random());
      selected = [...selected, ...remaining.slice(0, this.totalQuestions - selected.length)];
    }

    // Shuffle the selected questions and their answers so their order is random during the simulation
    selected = selected.map(q => ({
      ...q,
      answers: [...q.answers].sort(() => 0.5 - Math.random())
    })).sort(() => 0.5 - Math.random());

    this.questions.set(selected);
  }

  startSimulation() {
    this.isStarted.set(true);
    this.startTimer();
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLElement;
    if (target && target.parentElement) {
      target.parentElement.style.display = 'none';
    }
  }

  startTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeElapsed.update(t => t + 1);
    });
  }

  selectAnswer(answer: Answer) {
    if (this.isAnswered()) return;

    this.selectedAnswer.set(answer);
    this.isAnswered.set(true);

    const question = this.currentQuestion();
    const moduleTitle = question.moduleTitle || 'Outros';

    this.modulePerformance.update(perf => {
      const current = perf[moduleTitle] || { correct: 0, incorrect: 0 };
      return {
        ...perf,
        [moduleTitle]: {
          correct: current.correct + (answer.is_correct ? 1 : 0),
          incorrect: current.incorrect + (answer.is_correct ? 0 : 1)
        }
      };
    });

    if (answer.is_correct) {
      this.score.update(s => s + 1);
      this.isCorrect.set(true);
      this.isCorrectAnim.set(true);
      setTimeout(() => {
        this.isCorrectAnim.set(false);
        this.nextQuestion();
      }, 1500);
    } else {
      this.isCorrect.set(false);
      this.isWrongAnim.set(true);
      setTimeout(() => this.isWrongAnim.set(false), 800);
      this.triggerVibration();
    }
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
      this.isCorrect.set(false);
      this.selectedAnswer.set(null);
    } else {
      this.finishSimulation();
    }
  }

  finishSimulation() {
    this.timerSubscription?.unsubscribe();
    this.isFinished.set(true);
    this.saveSimulationResult();

    // Final points animation
    const pointsEarned = this.score();
    setTimeout(() => {
      this.showPointsAnim(`+${pointsEarned}`, 'positive', window.innerWidth / 2, window.innerHeight / 2);
    }, 500);
  }

  saveSimulationResult() {
    const data = localStorage.getItem('onboarding_answers') || '{}';
    const pointsEarned = this.score();

    try {
      const answers = JSON.parse(data) as OnboardingAnswers;
      const simulations = answers.simulations || [];
      simulations.push({
        date: new Date().toISOString(),
        score: this.score(),
        approved: this.score() >= 20,
        points_earned: pointsEarned,
        modulePerformance: this.modulePerformance()
      });
      answers.simulations = simulations;

      // Completion bonus: add the points earned in the simulation
      const currentPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
      const newPoints = currentPoints + pointsEarned;
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
    this.timeElapsed.set(0);
    this.isAnswered.set(false);
    this.selectedAnswer.set(null);
    this.modulePerformance.set({});
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
      return 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 md:hover:border-brand-400 md:hover:bg-brand-50/30 dark:md:hover:bg-brand-500/10 active:border-brand-400 active:bg-brand-50/30 dark:active:bg-brand-500/10 text-slate-700 dark:text-slate-300';
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
      return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 md:group-hover:bg-brand-500 md:group-hover:text-white group-active:bg-brand-500 group-active:text-white';
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
