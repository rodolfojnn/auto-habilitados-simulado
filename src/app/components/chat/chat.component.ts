import { Component, ChangeDetectionStrategy, signal, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { AppStoreService } from '../../app-store.service';

interface ApiMessage {
  created_at: string;
  aluno_id: number;
  de: 'Aluno' | 'Admin' | string;
  lidoAluno: number;
  conteudo: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: Date;
  dateGroup: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Button -->
    @if (!isOpen() && visibility.showChat()) {
      <button
        (click)="toggleChat()"
        class="fixed z-50 w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg shadow-brand-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style="bottom: max(1.25rem, calc(1rem + env(safe-area-inset-bottom, 0px))); right: max(1.25rem, calc(1rem + env(safe-area-inset-right, 0px)));"
      >
        <mat-icon class="material-icons">chat</mat-icon>
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
          class="bg-brand-600 text-white px-4 pb-4 flex items-center justify-between shrink-0 shadow-md z-10"
          style="padding-top: max(1rem, calc(0.875rem + env(safe-area-inset-top, 0px)));"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <mat-icon class="material-icons">support_agent</mat-icon>
            </div>
            <div>
              <h2 class="font-bold text-sm leading-tight">Suporte Simulado</h2>
              <p class="text-white/80 text-xs">Responderemos em breve</p>
            </div>
          </div>
          <button (click)="toggleChat()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <mat-icon class="material-icons">close</mat-icon>
          </button>
        </header>

        <!-- Messages Area -->
        <main class="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 flex flex-col gap-4" #scrollContainer>
          @if (isLoading() && messages().length === 0) {
            <div class="flex-1 flex items-center justify-center">
              <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          } @else {
            @if (messages().length === 0) {
              <div class="text-center">
                <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  Início da conversa
                </span>
              </div>
            }

            @for (msg of messages(); track msg.id; let i = $index) {
              @if (i === 0 || msg.dateGroup !== messages()[i - 1].dateGroup) {
                <div class="text-center my-2">
                  <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {{ msg.dateGroup }}
                  </span>
                </div>
              }

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
                    'rounded-br-none bg-brand-600 text-white': msg.sender === 'user',
                    'rounded-bl-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700': msg.sender === 'support'
                  }"
                >
                  @if (msg.sender === 'support') {
                    <div class="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-100 dark:border-slate-700">
                      <span class="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">Suporte</span>
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
          }
        </main>

        <!-- Input Area -->
        <footer
          class="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-3.5 pt-3 shrink-0 z-10"
          style="padding-bottom: max(1.25rem, calc(0.875rem + env(safe-area-inset-bottom, 0px)));"
        >
          <div class="flex items-end gap-2">
            <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center min-h-[48px] border border-transparent focus-within:border-brand-500/50 focus-within:bg-white dark:focus-within:bg-slate-800/90 transition-all shadow-inner">
              <input
                #msgInput
                type="text"
                [(ngModel)]="currentMessage"
                (keyup.enter)="sendMessage()"
                placeholder="Digite sua mensagem..."
                class="w-full bg-transparent text-slate-900 dark:text-white border-0 focus:ring-0 rounded-3xl px-4 py-3 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              >
            </div>
            <button
              (click)="sendMessage()"
              [disabled]="!currentMessage.trim() || isSending()"
              class="shrink-0 w-[48px] h-[48px] flex items-center justify-center bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-all shadow-md shadow-brand-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              @if (isSending()) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              } @else {
                <mat-icon class="material-icons !text-xl !w-5 !h-5 !leading-none ml-0.5">send</mat-icon>
              }
            </button>
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
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;
  private http = inject(HttpClient);
  public visibility = inject(AppStoreService);

  isOpen = signal(false);
  isLoading = signal(false);
  currentMessage = '';
  isTyping = signal(false);
  hasUnread = signal(false);
  isSending = signal(false);

  messages = signal<ChatMessage[]>([]);

  private userName = '';
  private userCep = '';
  private timerId: any;
  private endpointList = 'https://api.dirigiragora.com.br/v1/simulado/chat/chatList';
  private endpointMsgs = 'https://api.dirigiragora.com.br/v1/simulado/chat/chatMsgs';
  private endpointSend = 'https://api.dirigiragora.com.br/v1/simulado/chat/sendMsg';

  ngOnInit() {
    this.loadUserData();
    this.fetchData();
    this.scheduleNextPoll();
  }

  ngOnDestroy() {
    if (this.timerId) clearTimeout(this.timerId);
  }

  private loadUserData() {
    try {
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const answers = JSON.parse(data);
        this.userName = answers?.lead_data?.nome || '';
        this.userCep = answers?.lead_data?.cep || '';
      }
    } catch {
      // Ignora erro
    }
  }

  private scheduleNextPoll() {
    if (this.timerId) clearTimeout(this.timerId);
    const interval = this.isOpen() ? 10000 : 120000; // 10s aberto (Msgs), 2m fechado (List)
    this.timerId = setTimeout(() => {
      this.fetchData();
      this.scheduleNextPoll();
    }, interval);
  }

  private fetchData() {
    if (!this.userName || !this.userCep) {
      this.loadUserData();
    }

    if (!this.userName || !this.userCep) return;

    if (this.isOpen()) {
      this.fetchMessages();
    } else {
      this.fetchList();
    }
  }

  private fetchList() {
    this.http.post<{ success: boolean, unreadAluno: number }>(this.endpointList, {
      nome: this.userName,
      cep: this.userCep
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.hasUnread.set(res.unreadAluno > 0);
        }
      },
      error: () => {
        // Silencioso
      }
    });
  }

  private fetchMessages(isInitialOpen = false) {
    this.http.post<{ success: boolean, messages: ApiMessage[] }>(this.endpointMsgs, {
      nome: this.userName,
      cep: this.userCep,
      chatAberto: true
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.messages) {
          this.processApiMessages(res.messages, isInitialOpen);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private formatDateGroup(d: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      return 'Hoje';
    }
    if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) {
      return 'Ontem';
    }

    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  private processApiMessages(apiMessages: ApiMessage[], isInitialOpen = false) {
    let unread = false;
    const mapped: ChatMessage[] = apiMessages.map((m, i) => {
      if (m.lidoAluno === 0 && m.de !== 'Aluno') {
        unread = true;
      }
      const time = new Date(m.created_at.replace(' ', 'T'));
      return {
        id: `${m.created_at}-${i}`,
        text: m.conteudo,
        sender: m.de === 'Aluno' ? 'user' : 'support',
        time: time,
        dateGroup: this.formatDateGroup(time)
      };
    });

    this.messages.set(mapped);

    // Atualiza notificação se fechado e houver não lidas
    if (!this.isOpen()) {
      this.hasUnread.set(unread);
    } else {
      this.hasUnread.set(false);
    }

    // Só scrolla se houver mudanças reais (simplificado)
    this.scrollToBottom(isInitialOpen ? 'auto' : 'smooth');
  }

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.hasUnread.set(false);

      // If messages array is empty, show loading state while fetching initial messages
      if (this.messages().length === 0) {
        this.isLoading.set(true);
      }

      this.fetchMessages(true);
      this.scheduleNextPoll();
      this.scrollToBottom('auto');
    } else {
      this.scheduleNextPoll();
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim() || !this.userName || !this.userCep || this.isSending()) return;

    const msgText = this.currentMessage.trim();
    this.currentMessage = '';
    this.isSending.set(true);

    // Otimização: Forçar o scroll imediatamente para a nova mensagem se ajustar
    this.scrollToBottom('smooth');

    // Envia para API
    this.http.post<{ success: boolean, messages: ApiMessage[] }>(this.endpointSend, {
      nome: this.userName,
      cep: this.userCep,
      conteudo: msgText
    }).subscribe({
      next: (res) => {
        this.isSending.set(false);
        if (res.success && res.messages) {
          this.processApiMessages(res.messages);
          // Reinicia o timer do polling para pular a próxima chamada do chatMsgs
          this.scheduleNextPoll();
        }
      },
      error: () => {
        this.isSending.set(false);
        // Restaura a mensagem em caso de erro para o aluno tentar novamente
        this.currentMessage = msgText;
      }
    });
  }

  scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    // Usamos setTimeout de 0ms e requestAnimationFrame para garantir que ocorra imediatamente
    // após a renderização do Angular, mas antes do próximo frame ser desenhado na tela,
    // eliminando o "flick" visual.
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (this.scrollContainer?.nativeElement) {
          const el = this.scrollContainer.nativeElement;
          el.scrollTo({ top: el.scrollHeight, behavior });
        }
      });
    }, 0);
  }

  ngAfterViewInit() {
    if (this.isOpen()) {
      this.scrollToBottom('auto');
    }
  }
}
