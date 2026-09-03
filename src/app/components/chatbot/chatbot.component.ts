import { Component, ChangeDetectionStrategy, signal, ElementRef, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppStoreService } from '../../app-store.service';
import { Router } from '@angular/router';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: Date;
}

interface ChatOption {
  label: string;
  nextStep: string;
  action?: 'navigate_simulado' | 'navigate_duelo';
}

interface ChatStep {
  id: string;
  botMessage: string;
  options?: ChatOption[];
}

const CHAT_FLOW: Record<string, ChatStep> = {
  welcome: {
    id: 'welcome',
    botMessage: 'Olá! Sou o assistente virtual do Simulado CNH. Como posso te ajudar hoje?',
    options: [
      { label: 'Preciso de dicas para a prova', nextStep: 'dicas' },
      { label: 'Tenho dúvidas sobre o app', nextStep: 'duvidas_app' },
      { label: 'Só queria dar um oi', nextStep: 'oi' }
    ]
  },
  dicas: {
    id: 'dicas',
    botMessage: 'Claro! Para a prova, recomendamos estudar bastante as placas de sinalização e direção defensiva. Quer testar seus conhecimentos agora?',
    options: [
      { label: 'Sim, vamos lá!', nextStep: 'inicio_simulado', action: 'navigate_simulado' },
      { label: 'Não, obrigado', nextStep: 'tudo_bem' }
    ]
  },
  duvidas_app: {
    id: 'duvidas_app',
    botMessage: 'O app oferece simulados reais, histórico de pontuação, um ranking mensal para você competir e até um modo de Duelo. O que mais quer saber?',
    options: [
      { label: 'Como funciona o Duelo?', nextStep: 'duelo_info' },
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },
  oi: {
    id: 'oi',
    botMessage: 'Oi! Que bom ter você por aqui. Boa sorte nos seus estudos e contagem de pontos!',
    options: [
      { label: 'Obrigado!', nextStep: 'tudo_bem' },
      { label: 'Voltar', nextStep: 'welcome' }
    ]
  },
  duelo_info: {
    id: 'duelo_info',
    botMessage: 'No modo Duelo você joga contra outras pessoas online, e quem responder as perguntas corretamente mais rápido ganha mais pontos! Quer experimentar?',
    options: [
      { label: 'Jogar agora', nextStep: 'inicio_duelo', action: 'navigate_duelo' },
      { label: 'Depois eu vejo', nextStep: 'tudo_bem' }
    ]
  },
  tudo_bem: {
    id: 'tudo_bem',
    botMessage: 'Sem problemas! Se precisar de mais alguma ajuda, é só me chamar aqui.',
    options: [
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },
  inicio_simulado: {
    id: 'inicio_simulado',
    botMessage: 'Ótimo! Te levei para a tela do simulado. Boa sorte!',
    options: [
      { label: 'Voltar ao início', nextStep: 'welcome' }
    ]
  },
  inicio_duelo: {
    id: 'inicio_duelo',
    botMessage: 'Prepare-se! Te redirecionei para a tela de duelos.',
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
        class="fixed z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
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
        <header
          class="bg-red-600 text-white px-4 pb-4 flex items-center justify-between shrink-0 shadow-md z-10"
          style="padding-top: max(1rem, calc(0.875rem + env(safe-area-inset-top, 0px)));"
        >
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
        </header>

        <!-- Messages Area -->
        <main class="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 flex flex-col gap-4 pb-32" #scrollContainer>
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
                  'rounded-br-none bg-red-600 text-white': msg.sender === 'user',
                  'rounded-bl-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700': msg.sender === 'support'
                }"
              >
                @if (msg.sender === 'support') {
                  <div class="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-100 dark:border-slate-700">
                    <span class="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Assistente</span>
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
        <footer
          class="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-3.5 pt-3 pb-4 shrink-0 z-10"
          style="padding-bottom: max(1rem, calc(1rem + env(safe-area-inset-bottom, 0px)));"
        >
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
      // First time loading, set unread badge to draw attention
      this.hasUnread.set(true);
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
        }
      }
    }, 800 + Math.random() * 700); // Random delay between 800ms and 1500ms
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
