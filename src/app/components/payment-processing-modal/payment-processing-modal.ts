import { Component, ChangeDetectionStrategy, input, output, signal, effect, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-processing-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
          (click)="handleClose()"
          (keydown.enter)="handleClose()"
          tabindex="0"
        ></div>

        <!-- Modal Box -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-scale-in">

          <!-- Header / Status Icon -->
          <div class="p-6 pb-2 flex items-start justify-between gap-3">
            @if (isApproved()) {
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 animate-bounce-subtle">
                <mat-icon class="material-icons !text-[28px] !w-7 !h-7 !leading-none">check_circle</mat-icon>
              </div>
            } @else {
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <mat-icon class="material-icons !text-[28px] !w-7 !h-7 !leading-none animate-spin-slow">hourglass_top</mat-icon>
              </div>
            }

            <button
              type="button"
              (click)="handleClose()"
              class="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <mat-icon class="material-icons !text-2xl !w-6 !h-6 !leading-6">close</mat-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-3 flex flex-col gap-4">
            <div>
              <h3 id="payment-modal-title" class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                @if (isApproved()) {
                  Pagamento confirmado!
                } @else {
                  Processando seu pagamento...
                }
              </h3>

              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                @if (isApproved()) {
                  Seu acesso ilimitado ao simulado já foi liberado com sucesso. Bons estudos!
                } @else {
                  O Google Play pode levar alguns segundos para confirmar a transação. Não se preocupe: se você concluiu a compra, o acesso ilimitado será liberado automaticamente.
                }
              </p>
            </div>

            @if (!isApproved()) {
              <!-- Live verification progress card -->
              <div class="bg-[#f0f9f4] dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-800/40 rounded-2xl p-3.5 flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <mat-icon class="material-icons !text-[18px] !w-[18px] !h-[18px] !leading-none animate-spin">
                    sync
                  </mat-icon>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold text-emerald-900 dark:text-emerald-300 truncate">
                    @if (isChecking()) {
                      Consultando o Google Play agora...
                    } @else {
                      Verificando aprovação automaticamente...
                    }
                  </p>
                  <p class="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                    Tentativa de sincronização: <span class="font-mono font-medium">{{ attempts() }}</span>
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="p-6 pt-3 flex flex-col gap-2.5">
            @if (isApproved()) {
              <button
                type="button"
                (click)="handleClose()"
                class="w-full flex items-center justify-center gap-2 bg-[#0b5d3b] hover:bg-[#094d31] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm sm:text-base py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Acessar o Simulado</span>
                <mat-icon class="material-icons !text-xl !w-5 !h-5 !leading-none">arrow_forward</mat-icon>
              </button>
            } @else {
              <!-- Botão Verificar Agora -->
              <button
                type="button"
                (click)="onVerifyClick()"
                [disabled]="isChecking()"
                class="w-full flex items-center justify-center gap-2 bg-[#0b5d3b] hover:bg-[#094d31] dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm sm:text-base py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <mat-icon class="material-icons !text-xl !w-5 !h-5 !leading-none" [class.animate-spin]="isChecking()">
                  sync
                </mat-icon>
                <span>{{ isChecking() ? 'Verificando...' : 'Verificar agora' }}</span>
              </button>

              <!-- Botão Reiniciar Aplicativo -->
              <button
                type="button"
                (click)="onRestartClick()"
                class="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm py-3 px-5 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
              >
                <mat-icon class="material-icons !text-lg !w-[18px] !h-[18px] !leading-none text-slate-500 dark:text-slate-400">
                  refresh
                </mat-icon>
                <span>Reiniciar aplicativo</span>
              </button>

              <!-- Botão Fechar -->
              <button
                type="button"
                (click)="handleClose()"
                class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-center cursor-pointer"
              >
                Fechar janela (continuar esperando)
              </button>
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    .animate-scale-in {
      animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .animate-spin-slow {
      animation: spinSlow 3s linear infinite;
    }
    .animate-bounce-subtle {
      animation: bounceSubtle 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.94) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes spinSlow {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(180deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes bounceSubtle {
      0% { transform: scale(0.8); }
      60% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `]
})
export class PaymentProcessingModal implements OnDestroy {
  isOpen = input<boolean>(false);
  isChecking = input<boolean>(false);
  isApproved = input<boolean>(false);

  verify = output<void>();
  restart = output<void>();
  closed = output<void>();

  attempts = signal<number>(1);
  private pollSub?: Subscription;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const approved = this.isApproved();

      if (open && !approved) {
        this.startAutoCheckPolling();
      } else {
        this.stopAutoCheckPolling();
      }

      if (open && approved) {
        // Quando aprovado, aguarda 2s e emite o fechamento caso o usuário não tenha clicado antes
        setTimeout(() => {
          if (this.isOpen()) {
            this.closed.emit();
          }
        }, 2000);
      }
    });
  }

  private startAutoCheckPolling(): void {
    this.stopAutoCheckPolling();
    this.attempts.set(1);

    // Consulta periodicamente a cada 3.5 segundos
    this.pollSub = interval(3500).subscribe(() => {
      if (!this.isApproved()) {
        this.attempts.update(n => n + 1);
        this.verify.emit();
      }
    });
  }

  private stopAutoCheckPolling(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = undefined;
    }
  }

  onVerifyClick(): void {
    this.attempts.update(n => n + 1);
    this.verify.emit();
  }

  onRestartClick(): void {
    this.restart.emit();
  }

  handleClose(): void {
    this.stopAutoCheckPolling();
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.stopAutoCheckPolling();
  }
}
