import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { LeadCaptureComponent } from '../../components/lead-capture/lead-capture';
import questionsData from '../../../assets/questions.json';
import { interval, Subscription } from 'rxjs';

interface RawAnswer {
  text: string;
  is_correct: boolean;
}

interface Question {
  title: string;
  difficulty: string;
  number: number;
  answers: RawAnswer[];
  explanation?: string;
  sign_code_ref?: string;
}

interface DuelAnswer {
  text: string;
  label: string;
  isCorrect: boolean;
  isSelected?: boolean;
}

interface FloatingPoint {
  id: number;
  value: string;
  type: 'positive' | 'negative';
  x: number;
  y: number;
}

@Component({
  selector: 'app-duel',
  standalone: true,
  imports: [MatIconModule, LeadCaptureComponent, DecimalPipe],
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
          @if (!isFound()) {
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
          } @else {
            <div class="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 relative">
              <div class="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-pulse-success"></div>
              <mat-icon class="material-icons text-emerald-500" style="font-size: 48px; width: 48px; height: 48px;">person_add</mat-icon>
            </div>
            <h2 class="text-3xl font-black text-emerald-500 mb-4 tracking-tight animate-fade-in-up">Oponente Encontrado!</h2>
            
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-lg shadow-emerald-500/5 border border-slate-100 dark:border-slate-700/50 mb-8 w-full max-w-xs animate-fade-in-up [animation-delay:200ms]">
               <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Seu Adversário</div>
               <div class="flex items-center justify-center gap-4">
                 <div class="w-14 h-14 rounded-full border-2 border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                   <span class="text-inherit font-black text-purple-600 dark:text-purple-400">{{ rivalInitials() }}</span>
                 </div>
                 <div class="flex flex-col text-left">
                   <span class="font-black text-slate-900 dark:text-white text-lg leading-tight">{{ rivalName() }}</span>
                   <span class="text-[10px] font-black opacity-60 uppercase tracking-widest text-slate-500 mt-0.5">{{ rivalCityUf() }}</span>
                 </div>
               </div>
            </div>

            <!-- Countdown -->
            <div class="flex flex-col items-center justify-center mt-2 animate-fade-in-up [animation-delay:400ms]">
              <div class="relative w-24 h-24 flex items-center justify-center">
                @for (c of [searchCountdown()]; track c) {
                  <div class="absolute text-[80px] font-black text-indigo-600 dark:text-indigo-400 tabular-nums drop-shadow-lg animate-countdown-pop leading-none">
                    {{ c }}
                  </div>
                }
              </div>
              <p class="text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 text-[10px]">Preparando a partida</p>
            </div>
          }
        </div>
      } @else {
        <!-- Live Duel Game State -->
        <div class="flex flex-col h-[calc(100dvh-80px)] md:h-screen max-w-2xl mx-auto overflow-hidden transition-colors"
          [class.animate-flash-error]="hasAnswered() && !isLastAnswerCorrect()"
          [class.animate-flash-success]="hasAnswered() && isLastAnswerCorrect()">

          <!-- Win Celebration Overlay -->
          @if (showWinCelebration()) {
            <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-fade-in overflow-hidden">
               <!-- Rays -->
               <div class="absolute w-[200vw] h-[200vw] animate-spin-slow opacity-20" style="background: repeating-conic-gradient(from 0deg, transparent 0deg 15deg, #10b981 15deg 30deg);"></div>

               <!-- Particles -->
               @for (p of winParticles; track p.id) {
                 <div class="absolute w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0"
                      [class]="p.colorClass"
                      [style.left.%]="p.x"
                      [style.animation]="p.animation">
                 </div>
               }

               <!-- Trophy & Text -->
               <div class="relative z-10 flex flex-col items-center animate-win-pop">
                 <div class="relative">
                   <div class="absolute inset-0 bg-yellow-400 blur-[50px] opacity-60 rounded-full animate-pulse"></div>
                   <mat-icon class="text-yellow-400 !w-40 !h-40 !text-[160px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">emoji_events</mat-icon>
                 </div>
                 <h1 class="text-6xl font-black text-white uppercase tracking-tighter mt-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style="-webkit-text-stroke: 2px #10b981;">VITÓRIA!</h1>
                 <div class="mt-4 px-6 py-2 bg-emerald-500/20 border-2 border-emerald-500 rounded-full backdrop-blur-md">
                   <p class="text-emerald-300 font-black text-xl tracking-widest">+ {{ myPoints() }} PONTOS</p>
                 </div>
               </div>
            </div>
          }

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

          <!-- Header (Compact with Timer) -->
          <header class="flex items-center justify-between px-6 py-2.5 shrink-0 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#020617]">
            <button (click)="cancelSearch()" class="w-9 h-9 flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <mat-icon class="text-slate-600 dark:text-white !text-lg">chevron_left</mat-icon>
            </button>
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-1.5 mb-0.5" [class.text-rose-500]="timeLeft() < 30">
                <mat-icon class="text-indigo-600 dark:text-indigo-400 !text-sm !w-4 !h-4" [class.!text-rose-500]="timeLeft() < 30">schedule</mat-icon>
                <span class="text-base font-black tabular-nums tracking-tight text-slate-900 dark:text-white" [class.!text-rose-500]="timeLeft() < 30">{{ formattedTime() }}</span>
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
                <span class="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">QUESTÃO {{ (currentIndex() + 1) | number:'1.0' }} DE {{ totalQuestions }}</span>
              </div>
              <div class="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
                <div class="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]" [style.width.%]="progress()"></div>
              </div>
            </div>

            <!-- Question Text -->
            <div class="text-center mb-4 shrink-0 bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-md border border-slate-100 dark:border-white/5 transition-all"
              [class.animate-shake]="hasAnswered() && !isLastAnswerCorrect()"
              [class.animate-pulse-success]="hasAnswered() && isLastAnswerCorrect()">
              <h2 class="text-lg font-black leading-tight text-slate-900 dark:text-white px-2">{{ currentQuestion()?.title }}</h2>
            </div>

            <!-- Answers -->
            <div class="space-y-3 flex-grow overflow-y-auto pr-1">
              @for (answer of answers(); track answer.label) {
                <button
                  (click)="selectAnswer(answer, $event)"
                  [disabled]="hasAnswered()"
                  class="w-full p-4 rounded-3xl border-2 text-left transition-all flex items-start gap-4 group relative overflow-hidden"
                  [class]="getAnswerClasses(answer)"
                >
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm transition-colors"
                    [class]="getBadgeClasses(answer)">
                    {{ answer.label }}
                  </div>
                  <span class="text-sm font-semibold leading-snug pt-1 flex-1" [class]="getTextClasses(answer)">
                    {{ answer.text }}
                  </span>
                  @if (hasAnswered()) {
                    @if (answer.isCorrect) {
                      <mat-icon class="material-icons shrink-0 text-emerald-500 pt-1">check_circle</mat-icon>
                    } @else if (answer.isSelected) {
                      <mat-icon class="material-icons shrink-0 text-rose-500 pt-1">cancel</mat-icon>
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
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">Você <span class="font-bold opacity-60 text-[8px] mt-0.5"></span></span>
                    <span class="text-sm font-black text-slate-900 dark:text-white">{{ myPointsFormatted() }} pts</span>
                  </div>
                </div>

                <!-- VS Badge -->
                <div class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span class="font-black text-xs italic text-slate-400 dark:text-slate-500">VS</span>
                </div>

                <!-- Rival -->
                <div class="flex items-center gap-3">
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><span class="font-bold opacity-60 text-[8px] mt-0.5"></span> {{ rivalName() }}</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white">{{ rivalPointsFormatted() }} pts</span>
                  </div>
                  <div class="w-12 h-12 rounded-full border-2 border-purple-500/30 dark:border-purple-500/50 bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center relative">
                    <span class="text-sm font-black text-purple-600 dark:text-purple-400">{{ rivalInitials() }}</span>
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
          <div (click)="!isFinished() && toggleStats()" (keydown.enter)="!isFinished() && toggleStats()" tabindex="0" class="absolute inset-0"></div>
          
          <div 
            class="w-full max-w-lg mx-auto bg-slate-900 border-t-2 border-slate-800 rounded-t-[2.5rem] p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative transition-transform duration-300 ease-out"
            [class.translate-y-full]="!showStats()"
            [class.translate-y-0]="showStats()"
          >
            <!-- Handle -->
            @if (!isFinished()) {
                <div class="absolute left-1/2 -top-3 -translate-x-1/2 w-16 h-1.5 bg-slate-700/50 rounded-full"></div>
            }

            <div class="text-center mb-6 pt-2">
              <h3 class="text-xl font-black text-white uppercase italic tracking-wide">
                {{ isFinished() ? (myPoints() > rivalPoints() ? '🏆 VOCÊ VENCEU!' : (myPoints() === rivalPoints() ? '🤝 EMPATE!' : '💥 VOCÊ PERDEU!')) : 'Placar da Partida' }}
              </h3>
            </div>

            <!-- Stats Container -->
            <div class="bg-slate-800/50 rounded-3xl border border-slate-700/50 mb-6 overflow-hidden shadow-inner">
              
              <!-- Main Score (Points) -->
              <div class="flex justify-between items-center p-5 border-b border-slate-700/50 relative bg-slate-800/30">
                <div class="absolute top-0 bottom-0 left-1/2 w-px bg-slate-700/50 -translate-x-1/2"></div>
                
                <!-- You -->
                <div class="flex-1 text-center">
                   <div class="w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                        [class]="myPoints() >= rivalPoints() ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-blue-500/50 bg-blue-500/20'">
                     <span class="text-sm font-black" [class]="myPoints() >= rivalPoints() ? 'text-emerald-400' : 'text-blue-400'">VU</span>
                   </div>
                   <div class="text-3xl font-black text-white tabular-nums" [class.text-emerald-400]="isFinished() && myPoints() >= rivalPoints()">{{ myPointsFormatted() }}</div>
                   <div class="flex flex-col mt-1">
                     <span class="text-[10px] font-black uppercase tracking-widest leading-none" [class]="myPoints() >= rivalPoints() ? 'text-emerald-400' : 'text-blue-400'">Você</span>
                     <span class="text-[8px] font-black opacity-50 uppercase tracking-widest text-slate-400 mt-0.5">{{ myCityUf() }}</span>
                   </div>
                </div>

                <!-- Center -->
                <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-inner relative z-10 shrink-0">
                   <span class="text-sm font-black italic text-slate-400">VS</span>
                </div>

                <!-- Rival -->
                <div class="flex-1 text-center">
                   <div class="w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        [class]="rivalPoints() > myPoints() ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-purple-500/50 bg-purple-500/20'">
                     <span class="text-sm font-black" [class]="rivalPoints() > myPoints() ? 'text-emerald-400' : 'text-purple-400'">{{ rivalInitials() }}</span>
                   </div>
                   <div class="text-3xl font-black text-white tabular-nums" [class.text-emerald-400]="isFinished() && rivalPoints() > myPoints()">{{ rivalPointsFormatted() }}</div>
                   <div class="flex flex-col mt-1">
                     <span class="text-[10px] font-black uppercase tracking-widest leading-none" [class]="rivalPoints() > myPoints() ? 'text-emerald-400' : 'text-purple-400'">{{ rivalName() }}</span>
                     <span class="text-[8px] font-black opacity-50 uppercase tracking-widest text-slate-400 mt-0.5">{{ rivalCityUf() }}</span>
                   </div>
                </div>
              </div>

              <!-- Detailed Stats -->
              <div class="py-3 px-1">
                <!-- Questão -->
                <div class="flex items-center justify-between py-2 relative group hover:bg-slate-800/40 transition-colors">
                  <div class="text-xl font-black text-blue-400 tabular-nums text-center w-1/3">{{ myCorrect() + myErrors() }}<span class="text-xs text-blue-400/50">/{{ totalQuestions }}</span></div>
                  <div class="w-1/3 flex justify-center relative z-10">
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center bg-slate-900 border border-slate-700/50 rounded-lg py-1 px-3 shadow-md">Respondidas</div>
                  </div>
                  <div class="text-xl font-black text-purple-400 tabular-nums text-center w-1/3">{{ rivalCorrect() + rivalErrors() }}<span class="text-xs text-purple-400/50">/{{ totalQuestions }}</span></div>
                </div>
                
                <!-- Acertos -->
                <div class="flex items-center justify-between py-2 relative group hover:bg-slate-800/40 transition-colors">
                  <div class="text-xl font-black text-emerald-400 tabular-nums text-center w-1/3">{{ myCorrect() | number:'2.0' }}</div>
                  <div class="w-1/3 flex justify-center relative z-10">
                    <div class="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest text-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1 px-3 shadow-md">Acertos</div>
                  </div>
                  <div class="text-xl font-black text-emerald-400 tabular-nums text-center w-1/3">{{ rivalCorrect() | number:'2.0' }}</div>
                </div>

                <!-- Erros -->
                <div class="flex items-center justify-between py-2 relative group hover:bg-slate-800/40 transition-colors">
                  <div class="text-xl font-black text-rose-400 tabular-nums text-center w-1/3">{{ myErrors() | number:'2.0' }}</div>
                  <div class="w-1/3 flex justify-center relative z-10">
                    <div class="text-[9px] font-black text-rose-500/80 uppercase tracking-widest text-center bg-rose-500/10 border border-rose-500/20 rounded-lg py-1 px-3 shadow-md">Erros</div>
                  </div>
                  <div class="text-xl font-black text-rose-400 tabular-nums text-center w-1/3">{{ rivalErrors() | number:'2.0' }}</div>
                </div>
              </div>
            </div>

            <button 
              (click)="isFinished() ? cancelSearch() : toggleStats()"
              class="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 block"
            >
              {{ isFinished() ? 'Novo Duelo' : 'Continuar Duelo' }}
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

    .animate-float-up { animation: floatUp 1s ease-out forwards; }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    .animate-pulse-success { animation: pulseSuccess 0.5s ease-out; }
    .animate-flash-error { animation: flashError 0.5s ease-out; }
    .animate-flash-success { animation: flashSuccess 0.5s ease-out; }
    .animate-error-pop { animation: errorPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-success-pop { animation: successPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; transform: translateY(10px); }

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
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes countdownPop {
      0% { transform: scale(0.3); opacity: 0; }
      20% { transform: scale(1.2); opacity: 1; }
      40% { transform: scale(1); opacity: 1; }
      80% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0; }
    }
    .animate-countdown-pop { animation: countdownPop 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    
    @keyframes spin-slow {
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    
    @keyframes winPop {
      0% { transform: scale(0.5); opacity: 0; }
      40% { transform: scale(1.1); opacity: 1; }
      60% { transform: scale(0.95); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-win-pop { animation: winPop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    
    @keyframes floatUpWin {
      0% { transform: translateY(100vh) rotate(0deg) scale(0.5); opacity: 0; }
      10% { opacity: 1; transform: translateY(80vh) rotate(45deg) scale(1); }
      90% { opacity: 1; transform: translateY(-80vh) rotate(315deg) scale(1); }
      100% { transform: translateY(-100vh) rotate(360deg) scale(0.5); opacity: 0; }
    }
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
  `]
})
export class DuelComponent implements OnInit, OnDestroy {
  isStarted = signal<boolean>(false);
  isSearching = signal<boolean>(false);
  isFound = signal<boolean>(false);
  searchCountdown = signal<number>(5);
  leadCaptured = signal<boolean>(false);
  showStats = signal<boolean>(false);
  isFinished = signal<boolean>(false);

  showWinCelebration = signal<boolean>(false);

  isCorrectAnim = signal<boolean>(false);
  isWrongAnim = signal<boolean>(false);
  floatingPoints = signal<FloatingPoint[]>([]);
  private nextFpId = 0;

  winParticles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.floor(Math.random() * 100),
    colorClass: ['bg-yellow-400', 'bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-white'][i % 5],
    animation: `floatUpWin ${1.5 + Math.random() * 2}s linear forwards ${Math.random() * 0.5}s`
  }));

  questions = signal<Question[]>([]);
  currentIndex = signal<number>(0);
  answers = signal<DuelAnswer[]>([]);

  myPoints = signal<number>(0);
  myCorrect = signal<number>(0);
  myErrors = signal<number>(0);

  rivalPoints = signal<number>(0);
  rivalCorrect = signal<number>(0);
  rivalErrors = signal<number>(0);

  rivalName = signal<string>('Rival');
  rivalInitials = signal<string>('R');
  rivalCityUf = signal<string>('São Paulo - SP');
  myCityUf = signal<string>('São Paulo - SP');

  timeLeft = signal<number>(180); // 3 minutes
  private timerSubscription?: Subscription;
  private rivalSubscription?: Subscription;
  private findTimeoutRef?: any;
  private countdownIntervalRef?: any;

  readonly totalQuestions = 10;

  instructions = [
    { icon: 'shuffle', label: 'Você será conectado com um <strong class="text-brand-900 dark:text-white">jogador aleatório</strong>.', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    { icon: 'format_list_numbered', label: 'O duelo contém <strong class="text-brand-900 dark:text-white">10 questões</strong> de múltipla escolha.', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
    { icon: 'timer', label: 'Respostas <strong class="text-brand-900 dark:text-white">mais rápidas</strong> garantem mais pontos.', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    { icon: 'check_circle', label: 'Vence quem tiver o melhor <strong class="text-brand-900 dark:text-white">equilíbrio</strong> de acertos e tempo!', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' }
  ];

  formattedTime = computed(() => {
    const mins = Math.floor(this.timeLeft() / 60);
    const secs = this.timeLeft() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  progress = computed(() => {
    return Math.round(((this.currentIndex()) / this.totalQuestions) * 100);
  });

  currentQuestion = computed(() => {
     if (this.questions().length === 0) return null;
     return this.questions()[this.currentIndex()];
  });

  hasAnswered = computed(() => {
     return this.answers().some(a => a.isSelected);
  });

  isLastAnswerCorrect = computed(() => {
     return this.answers().some(a => a.isSelected && a.isCorrect);
  });

  myPointsFormatted = computed(() => this.myPoints().toString());
  rivalPointsFormatted = computed(() => this.rivalPoints().toString());

  ngOnInit() {
    this.checkLeadStatus();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.rivalSubscription?.unsubscribe();
  }

  toggleStats() {
    this.showStats.update(v => !v);
  }

  getAnswerClasses(answer: DuelAnswer): string {
    if (!this.hasAnswered()) {
      return 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300';
    }
    
    if (answer.isCorrect) {
      return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    }
    
    if (answer.isSelected && !answer.isCorrect) {
      return 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400';
    }
    
    return 'border-slate-100 dark:border-white/5 opacity-50 bg-white dark:bg-slate-800 text-slate-400';
  }

  getBadgeClasses(answer: DuelAnswer): string {
    if (!this.hasAnswered()) {
      return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-500 group-hover:text-white';
    }
    
    if (answer.isCorrect) {
      return 'bg-emerald-500 text-white';
    }
    
    if (answer.isSelected && !answer.isCorrect) {
      return 'bg-rose-500 text-white';
    }
    
    return 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600';
  }

  getTextClasses(answer: DuelAnswer): string {
    if (!this.hasAnswered()) return 'text-slate-700 dark:text-slate-300';
    if (answer.isCorrect) return 'text-emerald-800 dark:text-emerald-300';
    if (answer.isSelected && !answer.isCorrect) return 'text-rose-800 dark:text-rose-300';
    return 'text-slate-400 dark:text-slate-600';
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

  selectAnswer(answer: DuelAnswer, event: MouseEvent) {
    if (this.hasAnswered() || this.isFinished()) return;
    
    const mapped = this.answers().map(a => {
      if (a.label === answer.label) {
        return { ...a, isSelected: true };
      }
      return a;
    });
    this.answers.set(mapped);
    
    if (answer.isCorrect) {
       this.isCorrectAnim.set(true);
       setTimeout(() => this.isCorrectAnim.set(false), 800);
       this.showPointsAnim('+1', 'positive', event.clientX, event.clientY);
       this.myPoints.update(p => p + 1);
       this.myCorrect.update(c => c + 1);
    } else {
       this.isWrongAnim.set(true);
       setTimeout(() => this.isWrongAnim.set(false), 800);
       this.showPointsAnim('-3', 'negative', event.clientX, event.clientY);
       this.triggerVibration();
       this.myPoints.update(p => p - 3);
       this.myErrors.update(e => e + 1);
    }
    
    setTimeout(() => {
       if (this.currentIndex() < this.totalQuestions - 1) {
           this.currentIndex.update(i => i + 1);
           this.loadQuestionAnswers();
       } else {
           this.finishDuel();
       }
    }, 1500);
  }

  onLeadCaptured() {
    this.leadCaptured.set(true);
    const data = JSON.parse(localStorage.getItem('onboarding_answers') || '{}');
    data.lead_captured = true;
    localStorage.setItem('onboarding_answers', JSON.stringify(data));
  }

  checkLeadStatus() {
    const data = localStorage.getItem('onboarding_answers');
    if (data) {
      try {
        const answers = JSON.parse(data) as Record<string, any>;
        if (answers && answers['lead_captured'] === true) {
          this.leadCaptured.set(true);
        }
        
        // Mock a city for the user based on CEP if we had an API, or just default it
        // For now, let's just pick one randomly for the user too or default
      } catch {
        // ignore parse error
      }
    }
    
    // Set a random user city if none isn't needed here anymore since we do it in startDuel,
    // but we can initialize it if it's default
  }

  startDuel() {
    this.isStarted.set(true);
    this.isSearching.set(true);
    this.isFound.set(false);
    this.searchCountdown.set(5);
    this.prepareQuestions();
    
    // Set a random user city if none
    const cities = [
      'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Salvador - BA', 'Fortaleza - CE',
      'Brasília - DF', 'Curitiba - PR', 'Manaus - AM', 'Recife - PE', 'Goiania - GO', 'Porto Alegre - RS',
      'Campinas - SP', 'São Luís - MA', 'São Gonçalo - RJ', 'Maceió - AL', 'Duque de Caxias - RJ',
      'Natal - RN', 'Campo Grande - MS', 'Teresina - PI', 'Nova Iguaçu - RJ', 'João Pessoa - PB',
      'Santo André - SP', 'Ribeirão Preto - SP', 'Osasco - SP', 'Uberlândia - MG', 'Sorocaba - SP',
      'Contagem - MG', 'Aracaju - SE', 'Feira de Santana - BA', 'Cuiabá - MT', 'Joinville - SC',
      'Juiz de Fora - MG', 'Londrina - PR', 'Ananindeua - PA', 'Niterói - RJ', 'Porto Velho - RO',
      'Belford Roxo - RJ', 'Serra - ES', 'Caxias do Sul - RS', 'Vila Velha - ES', 'Florianópolis - SC',
      'Macapá - AP', 'Mauá - SP', 'São João de Meriti - RJ', 'Santos - SP'
    ];
    this.myCityUf.set(cities[Math.floor(Math.random() * cities.length)]);

    const fakeNames = [
      'Ana', 'Beatriz', 'Bruna', 'Camila', 'Carolina', 'Catarina', 'Cecília', 'Clara', 'Danielle', 'Eduarda',
      'Elisa', 'Emanuelly', 'Esther', 'Evelyn', 'Fernanda', 'Gabriela', 'Giovanna', 'Helena', 'Heloísa', 'Isabel',
      'Isabela', 'Isadora', 'Júlia', 'Juliana', 'Lara', 'Larissa', 'Laura', 'Lavínia', 'Letícia', 'Lívia',
      'Lorena', 'Luana', 'Luiza', 'Malu', 'Manuela', 'Maria', 'Mariana', 'Marina', 'Melissa', 'Milena',
      'Natália', 'Nicole', 'Nina', 'Pietra', 'Rebeca', 'Sarah', 'Sofia', 'Stella', 'Valentina', 'Vitória',
      'Yasmin', 'Alexandre', 'André', 'Arthur', 'Augusto', 'Benício', 'Bernardo', 'Breno', 'Bruno', 'Caio',
      'Caleb', 'Cauã', 'Daniel', 'Davi', 'Diego', 'Diogo', 'Eduardo', 'Emanuel', 'Enrico', 'Enzo',
      'Felipe', 'Fernando', 'Francisco', 'Gabriel', 'Gael', 'Guilherme', 'Gustavo', 'Heitor', 'Henrique', 'Igor',
      'Isaac', 'Joaquim', 'João', 'Leonardo', 'Levi', 'Lucas', 'Lucca', 'Marcelo', 'Marcos', 'Matheus',
      'Miguel', 'Murilo', 'Nicolas', 'Noah', 'Otávio', 'Pedro', 'Rafael', 'Renato', 'Rodrigo', 'Samuel',
      'Thiago', 'Tomás', 'Victor', 'Vinícius', 'Vitor', 'Yuri'
    ];

    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const initials = randomName.substring(0, 1).toUpperCase();
    this.rivalName.set(randomName);
    this.rivalInitials.set(initials);
    this.rivalCityUf.set(cities[Math.floor(Math.random() * cities.length)]);

    const searchDelay = Math.floor(Math.random() * 2000) + 2000; // 2 to 4 seconds

    clearTimeout(this.findTimeoutRef);
    clearInterval(this.countdownIntervalRef);

    this.findTimeoutRef = setTimeout(() => {
      this.isFound.set(true);
      
      this.countdownIntervalRef = setInterval(() => {
        if (this.searchCountdown() > 1) {
          this.searchCountdown.update(c => c - 1);
        } else {
          clearInterval(this.countdownIntervalRef);
          this.isSearching.set(false);
          this.startTimer();
          this.simulateRival();
        }
      }, 1000);
    }, searchDelay);
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

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    this.questions.set(shuffled.slice(0, this.totalQuestions));
    this.currentIndex.set(0);
    this.loadQuestionAnswers();
  }

  loadQuestionAnswers() {
    const q = this.currentQuestion();
    if (!q) return;
    
    // Shuffle answers and pick first 4
    const qAnswers = [...q.answers].sort(() => 0.5 - Math.random());
    const mapped: DuelAnswer[] = qAnswers.map((a, i) => ({
      text: a.text,
      label: String.fromCharCode(65 + i),
      isCorrect: a.is_correct,
      isSelected: false
    }));
    this.answers.set(mapped);
  }

  startTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.finishDuel();
      }
    });
  }

  simulateRival() {
    this.rivalSubscription?.unsubscribe();
    const scheduleNextRivalAnswer = () => {
       if (this.isFinished() || !this.isStarted()) return;
       if (this.rivalCorrect() + this.rivalErrors() >= this.totalQuestions) {
           this.finishDuel();
           return;
       }

       const delay = Math.floor(Math.random() * 10000) + 10000; // 10 to 20 seconds
       const sub = interval(delay).subscribe(() => {
           sub.unsubscribe();
           if (this.isFinished()) return;
           
           const isRivalCorrect = Math.random() > 0.3; // 70% accuracy
           if (isRivalCorrect) {
               this.rivalPoints.update(p => p + 1);
               this.rivalCorrect.update(c => c + 1);
           } else {
               this.rivalPoints.update(p => p - 3);
               this.rivalErrors.update(e => e + 1);
           }
           
           if (this.rivalCorrect() + this.rivalErrors() >= this.totalQuestions) {
               this.finishDuel();
           } else {
               scheduleNextRivalAnswer();
           }
       });
       this.rivalSubscription = sub;
    };

    scheduleNextRivalAnswer();
  }

  finishDuel() {
      if (this.isFinished()) return;
      this.isFinished.set(true);
      this.timerSubscription?.unsubscribe();
      this.rivalSubscription?.unsubscribe();
      
      if (this.myPoints() > this.rivalPoints()) {
         this.showWinCelebration.set(true);
         setTimeout(() => {
           this.showWinCelebration.set(false);
           this.showStats.set(true);
         }, 5000);

         const currentPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
         const newPoints = Math.max(0, currentPoints + this.myPoints()); 
         localStorage.setItem('user_points', newPoints.toString());
         window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: newPoints }));
      } else {
         this.showStats.set(true);
         const currentPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
         const newPoints = Math.max(0, currentPoints + this.myPoints()); // They keep their score (even if negative it reduces their total)
         localStorage.setItem('user_points', newPoints.toString());
         window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: newPoints }));
      }
  }

  cancelSearch() {
    this.isStarted.set(false);
    this.isSearching.set(false);
    this.isFound.set(false);
    this.showWinCelebration.set(false);
    this.showStats.set(false);
    this.isFinished.set(false);
    this.timerSubscription?.unsubscribe();
    this.rivalSubscription?.unsubscribe();
    clearTimeout(this.findTimeoutRef);
    clearInterval(this.countdownIntervalRef);

    this.myPoints.set(0);
    this.myCorrect.set(0);
    this.myErrors.set(0);
    this.rivalPoints.set(0);
    this.rivalCorrect.set(0);
    this.rivalErrors.set(0);
    this.currentIndex.set(0);
    this.timeLeft.set(180);
  }
}
