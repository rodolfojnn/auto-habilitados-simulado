import { Component, ChangeDetectionStrategy, signal, ElementRef, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppStoreService } from '../../app-store.service';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: Date;
}

interface ChatOption {
  label: string;
  nextStep: string;
  action?: 'navigate_simulado' | 'navigate_app_aulas' | 'navigate_duelo' | string;
}

interface ChatStep {
  id: string;
  botMessage: string;
  options?: ChatOption[];
}

const CHAT_FLOW: Record<string, ChatStep> = {
  // 1º ACESSO
  welcome: {
    id: 'welcome',
    botMessage: 'Precisa de ajuda para agendar a Prova Teórica no DETRAN?',
    options: [
      { label: 'Como faço para agendar?', nextStep: 'passo_agendamento' },
      { label: 'Já agendei! Estou revisando.', nextStep: 'pos_agendamento' }
    ]
  },

  // RETORNO (Se já tinha informado que agendou)
  welcome_retorno: {
    id: 'welcome_retorno',
    botMessage: 'Como está o andamento da sua Prova Teórica?',
    options: [
      { label: 'Passei na prova!', nextStep: 'aulas_praticas' },
      { label: 'Ainda vou fazer, estou estudando', nextStep: 'preparando_prova' },
      { label: 'Preciso de ajuda no agendamento', nextStep: 'passo_agendamento' },
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },

  // DUVIDA AGENDAMENTO
  passo_agendamento: {
    id: 'passo_agendamento',
    botMessage: 'Agende pelo site do DETRAN do seu estado ou unidades físicas de atendimento DETRAN. Após passar, a próxima etapa são as Aulas Práticas!',
    options: [
      { label: 'Aulas Práticas', nextStep: 'aulas_praticas' },
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },

  // JÁ AGENDOU
  pos_agendamento: {
    id: 'pos_agendamento',
    botMessage: 'Bons estudos! Você já pode ir escolhendo seu instrutor para não perder tempo após ser aprovado. Mantendo aula já agendadas, você agiliza a finalizaçâo do seu processo!',
    options: [
      { label: 'Ver Instrutores', nextStep: 'aulas_praticas', action: 'navigate_app_aulas' },
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },

  // ESTUDANDO
  preparando_prova: {
    id: 'preparando_prova',
    botMessage: 'Bons estudos! No app Dirigir Agora, você compara preços e escolhe os melhores instrutores da sua região. O melhor: você conta com suporte humano, aulas onde preferir e apoio para agendar sua prova prática no DETRAN.',
    options: [
      { label: 'Ver Instrutores e Preços', nextStep: 'aulas_praticas' },
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },

  // CONVERSÃO (APP DE AULAS)
  aulas_praticas: {
    id: 'aulas_praticas',
    botMessage: 'No app Dirigir Agora, você compara preços e escolhe os melhores instrutores da sua região. O melhor: você conta com suporte humano, aulas onde preferir e apoio para agendar sua prova prática no DETRAN.',
    options: [
      { label: 'Aulas Práticas', nextStep: 'direciona_app_aulas', action: 'navigate_app_aulas' },
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },

  // AÇÕES
  inicio_simulado: {
    id: 'inicio_simulado',
    botMessage: 'Abrindo simulados...',
    options: [
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },

  direciona_app_aulas: {
    id: 'direciona_app_aulas',
    botMessage: 'Redirecionando para o App de Aulas Práticas...',
    options: [
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  }
};

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Button -->
    @if (!isOpen() && visibility.showChat()) {
      <button
        (click)="toggleChat()"
        class="fixed z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style="bottom: max(1.25rem, calc(1rem + env(safe-area-inset-bottom, 0px))); right: max(1.25rem, calc(1rem + env(safe-area-inset-right, 0px)));"
      >
        <mat-icon class="material-icons">support_agent</mat-icon>
        @if (hasUnread()) {
          <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        }
      </button>
    }

    <!-- Chat Window Overlay (Mobile full screen, Desktop floating panel) -->
    @if (isOpen()) {
      <div class="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 flex flex-col bg-white dark:bg-slate-900 sm:w-[400px] sm:h-[600px] sm:rounded-3xl sm:border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fade-in-up">

        <!-- Header -->
        <header class="bg-blue-600 text-white shrink-0 shadow-md z-20 relative">
          <div style="height: env(safe-area-inset-top, 0px);"></div>
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <mat-icon class="material-icons">support_agent</mat-icon>
              </div>
              <div>
                <h2 class="font-bold text-sm leading-tight">Assistente Virtual</h2>
                <p class="text-white/80 text-xs">Sempre online</p>
              </div>
            </div>
            <button (click)="toggleChat()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <mat-icon class="material-icons">close</mat-icon>
            </button>
          </div>
        </header>

        <!-- Messages Area -->
        <main class="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 flex flex-col gap-4" #scrollContainer>
          @for (msg of messages(); track msg.id) {
            <div
              class="flex gap-2 max-w-[85%] animate-fade-in"
              [ngClass]="{
                'self-end flex-row-reverse': msg.sender === 'user',
                'self-start': msg.sender === 'support'
              }"
            >
              <div
                class="p-3 shadow-sm relative rounded-2xl"
                [ngClass]="{
                  'rounded-br-none bg-blue-600 text-white': msg.sender === 'user',
                  'rounded-bl-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700': msg.sender === 'support'
                }"
              >
                @if (msg.sender === 'support') {
                  <div class="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-100 dark:border-slate-700">
                    <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Assistente</span>
                  </div>
                }

                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>

                <span
                  class="text-[9px] block mt-1 flex items-center gap-1 opacity-80"
                  [ngClass]="{
                    'text-white/80 justify-end': msg.sender === 'user',
                    'text-slate-400 justify-end': msg.sender === 'support'
                  }"
                >
                  {{ msg.time | date:'HH:mm' }}
                  @if (msg.sender === 'user') {
                    <mat-icon class="material-icons !text-[12px] !w-[12px] !h-[12px] !leading-none text-white/90">done_all</mat-icon>
                  }
                </span>
              </div>
            </div>
          }

          @if (isTyping()) {
            <div class="flex gap-2 max-w-[85%] self-start animate-fade-in">
              <div class="p-3 shadow-sm rounded-2xl rounded-bl-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 h-[42px]">
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
              </div>
            </div>
          }
        </main>

        <!-- Options Area -->
        <footer class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 shrink-0 z-10">
          <div class="px-3.5 pt-3 pb-4">
            <div class="flex flex-col gap-2">
              @if (currentStep() && !isTyping()) {
                <div class="flex flex-wrap gap-2 justify-end">
                  @for (option of currentStep()?.options; track option.label) {
                    <button
                      (click)="selectOption(option)"
                      class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-full transition-colors border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
                    >
                      {{ option.label }}
                    </button>
                  }
                </div>
              }
            </div>
          </div>
          <div style="height: env(safe-area-inset-bottom, 0px);"></div>
        </footer>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

  public visibility = inject(AppStoreService);
  private router = inject(Router);

  isOpen = signal(false);
  hasUnread = signal(false);
  isTyping = signal(false);

  messages = signal<ChatMessage[]>([]);
  currentStep = signal<ChatStep | null>(null);

  private STORAGE_KEY = 'chatbot_messages';
  private STEP_KEY = 'chatbot_current_step';

  ngOnInit() {
    this.loadState();
  }

  ngAfterViewInit() {
    if (this.isOpen()) {
      this.scrollToBottom('auto');
    }
  }

  private loadState() {
    const savedMessages = localStorage.getItem(this.STORAGE_KEY);
    const savedStep = localStorage.getItem(this.STEP_KEY);
    const hasRead = localStorage.getItem('chatbot_has_read');

    if (!hasRead) {
      this.hasUnread.set(true);
    }

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert string dates back to Date objects
        this.messages.set(parsed.map((m: any) => ({ ...m, time: new Date(m.time) })));
      } catch (e) {
        console.log(e);
        this.initChat();
      }
    } else {
      // First time loading
      this.initChat();
    }

    if (savedStep && CHAT_FLOW[savedStep]) {
      this.currentStep.set(CHAT_FLOW[savedStep]);
    } else {
      this.currentStep.set(CHAT_FLOW['welcome']);
    }
  }

  private saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages()));
    if (this.currentStep()) {
      localStorage.setItem(this.STEP_KEY, this.currentStep()!.id);
    }
  }

  private initChat() {
    const step = CHAT_FLOW['welcome'];
    const botMsg: ChatMessage = {
      id: Date.now().toString(),
      text: step.botMessage,
      sender: 'support',
      time: new Date()
    };
    this.messages.set([botMsg]);
    this.currentStep.set(step);
    this.saveState();
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.hasUnread.set(false);
      localStorage.setItem('chatbot_has_read', 'true');
      this.scrollToBottom('auto');
    }
  }

  selectOption(option: ChatOption) {
    if (this.isTyping()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: option.label,
      sender: 'user',
      time: new Date()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.currentStep.set(null);
    this.saveState();
    this.scrollToBottom('smooth');

    // Simulate typing delay
    this.isTyping.set(true);
    this.scrollToBottom('smooth');

    setTimeout(() => {
      this.isTyping.set(false);

      const nextStep = CHAT_FLOW[option.nextStep];
      if (nextStep) {
        const botMsg: ChatMessage = {
          id: Date.now().toString(),
          text: nextStep.botMessage,
          sender: 'support',
          time: new Date()
        };
        this.messages.update(msgs => [...msgs, botMsg]);
        this.currentStep.set(nextStep);
        this.saveState();
        this.scrollToBottom('smooth');

        // Handle actions
        if (option.action === 'navigate_simulado') {
          this.toggleChat(); // Close chat
          this.router.navigate(['/simulado']);
        } else if (option.action === 'navigate_duelo') {
          this.toggleChat();
          this.router.navigate(['/duelo']);
        } else if (option.action === 'navigate_app_aulas') {
          this.toggleChat();
          this.navigateToAppAulas();
        }
      }
    }, 800 + Math.random() * 700); // Random delay between 800ms and 1500ms
  }

  async navigateToAppAulas() {
    const platform = Capacitor.getPlatform();
    let url = 'https://play.google.com/store/apps/details?id=br.com.dirigiragora&hl=pt_BR'; // fallback/android

    if (platform === 'ios') {
      url = 'https://apps.apple.com/br/app/dirigir-agora-cnh-do-brasil/id6801734923';
    } else if (platform === 'web') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        url = 'https://apps.apple.com/br/app/dirigir-agora-cnh-do-brasil/id6801734923';
      }
    }

    try {
      if (platform === 'web') {
        window.open(url, '_blank');
      } else {
        await Browser.open({ url });
      }
    } catch (e) {
      console.log(e);
      window.open(url, '_blank');
    }
  }

  scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (this.scrollContainer?.nativeElement) {
          const el = this.scrollContainer.nativeElement;
          el.scrollTo({ top: el.scrollHeight, behavior });
        }
      });
    }, 0);
  }
}
