import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { AppStoreService } from '../../app-store.service';
import { PurchaseService } from '../../purchase.service';
import { SupportModal } from '../../components/support-modal/support-modal';
import { PaymentProcessingModal } from '../../components/payment-processing-modal/payment-processing-modal';

@Component({
  selector: 'app-paywall-suporte',
  standalone: true,
  imports: [MatIconModule, SupportModal, PaymentProcessingModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full max-w-[440px] min-h-screen mx-auto bg-[#f3f9f5] dark:bg-slate-950 font-sans overflow-hidden px-5 pt-4 pb-10 box-border">
      <!-- Brilho decorativo do canto superior direito -->
      <div class="pointer-events-none absolute -top-16 -right-20 w-64 h-64 rounded-full bg-[#d4f5df] dark:bg-emerald-500/10 opacity-70 blur-2xl"></div>

      <!-- Barra Superior: Botão Voltar e Status -->
      <div class="relative z-20 flex items-center justify-between mb-2">
        <button
          type="button"
          (click)="voltar()"
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
          aria-label="Voltar"
        >
          <mat-icon class="material-icons !text-[20px] !w-5 !h-5 !leading-none">arrow_back</mat-icon>
        </button>

        @if (isPaid()) {
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-[#22a04b] dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30">
            <mat-icon class="material-icons !text-[16px] !w-4 !h-4 !leading-none">verified</mat-icon>
            Suporte Ativo
          </span>
        }
      </div>

      <!-- Cabeçalho: selo, título, descrição e imagem -->
      <div class="relative z-10 mt-1 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22a04b] text-white text-[11px] font-bold uppercase tracking-wide">
            <mat-icon class="material-icons !text-[16px] !w-4 !h-4 !leading-none">headset_mic</mat-icon>
            Atendimento humano
          </span>
          <h1 class="mt-3 text-[25px] leading-[1.1] font-extrabold tracking-tight text-[#0f1d3a] dark:text-white">
            Não fique perdido na hora de tirar <span class="text-[#22a04b] dark:text-emerald-400">sua CNH!</span>
          </h1>
          <p class="mt-3 text-[14px] leading-relaxed text-slate-600 dark:text-slate-300">
            Conte com nossa equipe para orientar você em cada etapa da habilitação pelo CNH do Brasil.
          </p>
        </div>

        <!-- Imagem do headset: versão clara e versão escura -->
        <div class="relative shrink-0 w-[130px] h-[130px] flex items-center justify-center">
          <img src="assets/headset-light.png" alt="" aria-hidden="true" class="w-[104px] h-[104px] object-contain drop-shadow-md dark:hidden" />
          <img src="assets/headset-dark.png" alt="" aria-hidden="true" class="hidden dark:block w-[104px] h-[104px] object-contain drop-shadow-md" />
        </div>
      </div>

      <!-- Lista de benefícios -->
      <div class="relative z-10 mt-4 bg-white dark:bg-slate-900 rounded-[22px] px-4 border border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div class="flex items-center gap-3 py-2.5">
          <div class="w-10 h-10 rounded-xl bg-[#e3f6ea] dark:bg-emerald-900/20 text-[#22a04b] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">chat_bubble_outline</mat-icon>
          </div>
          <div class="min-w-0">
            <h3 class="text-[15px] font-bold leading-snug text-[#0f1d3a] dark:text-white">Tire suas dúvidas</h3>
            <p class="text-[14px] leading-snug text-slate-500 dark:text-slate-400">com pessoas de verdade.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 py-2.5 border-t border-slate-100 dark:border-white/5">
          <div class="w-10 h-10 rounded-xl bg-[#e3f6ea] dark:bg-emerald-900/20 text-[#22a04b] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">calendar_month</mat-icon>
          </div>
          <div class="min-w-0">
            <h3 class="text-[15px] font-bold leading-snug text-[#0f1d3a] dark:text-white">Saiba como agendar</h3>
            <p class="text-[14px] leading-snug text-slate-500 dark:text-slate-400">suas provas e exames.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 py-2.5 border-t border-slate-100 dark:border-white/5">
          <div class="w-10 h-10 rounded-xl bg-[#e3f6ea] dark:bg-emerald-900/20 text-[#22a04b] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">location_on</mat-icon>
          </div>
          <div class="min-w-0">
            <h3 class="text-[15px] font-bold leading-snug text-[#0f1d3a] dark:text-white">Entenda todas as etapas</h3>
            <p class="text-[14px] leading-snug text-slate-500 dark:text-slate-400">do processo.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 py-2.5 border-t border-slate-100 dark:border-white/5">
          <div class="w-10 h-10 rounded-xl bg-[#e3f6ea] dark:bg-emerald-900/20 text-[#22a04b] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">fact_check</mat-icon>
          </div>
          <div class="min-w-0">
            <h3 class="text-[15px] font-bold leading-snug text-[#0f1d3a] dark:text-white">Resolva problemas</h3>
            <p class="text-[14px] leading-snug text-slate-500 dark:text-slate-400">com facilidade.</p>
          </div>
        </div>
      </div>

      <!-- Bloco WhatsApp: Bloqueado (antes de pagar) / Liberado (após pagamento) -->
      @if (!isPaid()) {
        <!-- Estado Bloqueado: ao clicar aciona a cobrança com o modal de processamento -->
        <div class="relative z-10 mt-5 rounded-[22px] bg-[#e8f6ee]/70 dark:bg-emerald-500/5 border border-[#d3eddc] dark:border-white/10 p-4 text-center">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wide">
            <mat-icon class="material-icons !text-[14px] !w-3.5 !h-3.5 !leading-none">lock</mat-icon>
            Bloqueado
          </span>
          <p class="mt-2 text-[12.5px] text-slate-500 dark:text-slate-400">
            Disponível após adquirir o suporte completo
          </p>

          <button
            type="button"
            (click)="liberarAcesso()"
            class="mt-3 w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            title="Clique para adquirir o suporte completo e desbloquear"
          >
            <mat-icon class="material-icons !text-[24px] !w-6 !h-6 !leading-none text-slate-500 dark:text-slate-400">chat</mat-icon>
            <span class="flex-1 text-center text-[14px] font-semibold">Acessar suporte pelo WhatsApp</span>
            <mat-icon class="material-icons !text-[18px] !w-[18px] !h-[18px] !leading-none text-slate-500 dark:text-slate-400">lock</mat-icon>
          </button>
        </div>
      } @else {
        <!-- Estado Liberado: botão ativo que direciona para o WhatsApp (11 5192-4353) -->
        <div class="relative z-10 mt-5 rounded-[22px] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-4 text-center">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-[#16883f] dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wide">
            <mat-icon class="material-icons !text-[14px] !w-3.5 !h-3.5 !leading-none">check_circle</mat-icon>
            Acesso Liberado
          </span>
          <p class="mt-2 text-[12.5px] text-emerald-800 dark:text-emerald-300 font-medium">
            Seu suporte está ativo! Toque abaixo para iniciar seu atendimento no WhatsApp:
          </p>

          <button
            type="button"
            (click)="openWhatsApp()"
            class="mt-3 w-full flex items-center justify-center gap-3 px-5 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[15px] shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <mat-icon class="material-icons !text-[24px] !w-6 !h-6 !leading-none">chat</mat-icon>
            <span class="flex-1 text-center">Acessar suporte pelo WhatsApp</span>
            <mat-icon class="material-icons !text-[20px] !w-5 !h-5 !leading-none">open_in_new</mat-icon>
          </button>
          <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            WhatsApp Oficial: (11) 5192-4353
          </p>
        </div>
      }

      <!-- Bloco de Preço ou Confirmação de Suporte Ativo -->
      @if (!isPaid()) {
        <!-- Card de preço -->
        <div class="relative z-10 mt-5 rounded-[24px] bg-gradient-to-r from-[#2fb05a] to-[#16883f] dark:from-emerald-600 dark:to-emerald-700 text-white px-5 py-4 shadow-lg shadow-emerald-700/20 dark:shadow-emerald-900/30 flex items-stretch">
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <span class="self-start px-3 py-1 rounded-full border border-white/50 text-[10px] font-semibold uppercase tracking-wider">Suporte completo</span>
            <div class="mt-2 flex items-baseline gap-1 whitespace-nowrap">
              <span class="text-lg font-semibold">R$</span>
              <span class="text-[36px] leading-none font-black tracking-tight">9,90</span>
            </div>
            <p class="mt-1 text-[11px] leading-snug opacity-90">Pagamento único · 30 dias de suporte</p>
          </div>

          <div class="w-px bg-white/30 mx-3 shrink-0"></div>

          <div class="w-[100px] shrink-0 flex flex-col items-center justify-center gap-1.5 text-center">
            <mat-icon class="material-icons !text-[32px] !w-8 !h-8 !leading-none">verified_user</mat-icon>
            <p class="text-[11px] leading-snug font-medium">Orientação em todas as etapas</p>
          </div>
        </div>

        <!-- Ação principal de compra -->
        <button
          type="button"
          (click)="liberarAcesso()"
          class="relative z-10 mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-full bg-gradient-to-r from-[#11873f] to-[#0a6330] hover:from-[#0f7737] hover:to-[#085529] text-white font-bold text-[16px] shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all cursor-pointer"
        >
          <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">credit_card</mat-icon>
          <span>Adquirir suporte completo</span>
          <mat-icon class="material-icons !text-[20px] !w-5 !h-5 !leading-none">arrow_forward</mat-icon>
        </button>

        <!-- Rodapé de segurança -->
        <div class="relative z-10 mt-4 flex items-center justify-center gap-2 text-center text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          <mat-icon class="material-icons !text-[16px] !w-4 !h-4 !leading-none shrink-0">lock</mat-icon>
          <p>
            Você será direcionado para o pagamento seguro.<br />
            Após a confirmação, o acesso será liberado imediatamente.
          </p>
        </div>
      } @else {
        <!-- Card de Suporte Já Ativo -->
        <div class="relative z-10 mt-5 rounded-[24px] bg-gradient-to-r from-[#2fb05a] to-[#16883f] dark:from-emerald-600 dark:to-emerald-700 text-white px-5 py-4 shadow-lg shadow-emerald-700/20 dark:shadow-emerald-900/30 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <mat-icon class="material-icons !text-[30px] !w-[30px] !h-[30px] !leading-none">verified</mat-icon>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-[15px] leading-tight">Suporte Completo Ativo</h4>
            <p class="text-xs opacity-90 mt-1">30 dias de orientação humana pelo WhatsApp inclusos.</p>
          </div>
        </div>

        <button
          type="button"
          (click)="openWhatsApp()"
          class="relative z-10 mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[16px] shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all cursor-pointer"
        >
          <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">chat</mat-icon>
          <span>Conversar no WhatsApp Agora</span>
          <mat-icon class="material-icons !text-[20px] !w-5 !h-5 !leading-none">arrow_forward</mat-icon>
        </button>
      }

      <!-- Modal de Suporte por E-mail -->
      <app-support-modal
        [isOpen]="showSupportModal()"
        (closed)="showSupportModal.set(false)"
      />

      <!-- Modal de Confirmação e Processamento de Pagamento (igual a simulation e duel) -->
      <app-payment-processing-modal
        [isOpen]="purchaseService.isProcessingPayment()"
        [isChecking]="purchaseService.isCheckingStatus()"
        [isApproved]="purchaseService.paymentConfirmedJustNow() || (isPaid() && purchaseService.isProcessingPayment())"
        [approvedTitle]="'Pagamento confirmado!'"
        [approvedMessage]="'Seu suporte completo foi ativado com sucesso! Você já pode falar diretamente com nossa equipe pelo WhatsApp.'"
        [approvedButtonText]="'Acessar Suporte pelo WhatsApp'"
        (verify)="purchaseService.verifyPaymentManually()"
        (restart)="purchaseService.restartApp()"
        (closed)="purchaseService.dismissProcessingModal()"
        (approvedAction)="openWhatsApp()"
      />

      <!-- Opção de teste em desenvolvimento / homologação para simular pagamento -->
      <!-- Não excluir código abaixo, quando eu precisar vou descomentar -->
      <!-- <div class="mt-4 text-center">
        <button
          type="button"
          (click)="simularPagamentoTeste()"
          class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer opacity-75 hover:opacity-100"
        >
          [Ambiente de Teste: Simular Pagamento Aprovado]
        </button>
      </div> -->

    </div>
  `,
})
export class PaywallSuporteComponent implements OnInit, OnDestroy {
  private store = inject(AppStoreService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public purchaseService = inject(PurchaseService);

  isPaid = computed(() => this.store.isPaid());
  showSupportModal = signal<boolean>(false);

  ngOnInit() {
    // Oculta o floating do chat nesta tela (mesmo padrão usado em simulado/duelo)
    this.store.showChat.set(false);
  }

  ngOnDestroy() {
    // Restaura o floating do chat ao sair da tela
    this.store.showChat.set(true);
  }

  voltar() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  liberarAcesso() {
    // Aciona a compra do Google Play ("valor_simulado") no Android ou abre o modal
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      this.purchaseService.buySimulado();
    } else {
      this.processarPagamento();
    }
  }

  processarPagamento() {
    if (Capacitor.getPlatform() === 'android') {
      this.purchaseService.buySimulado();
    } else {
      // Abre o modal de acompanhamento pós-pagamento
      this.purchaseService.buySimulado();
      this.snackBar.open('Iniciando compra de "valor_simulado"...', 'OK', {
        duration: 3500,
        panelClass: ['brand-snackbar']
      });
    }
  }

  private getWhatsAppMessage(): string {
    let name = '';
    let phone = '';
    let uf = '';
    let municipio = '';

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('onboarding_answers');
        if (raw) {
          const data = JSON.parse(raw);
          name = data.nome || data.name || '';
          phone = data.fone1 || data.phone || '';
          uf = data.uf || '';
          municipio = data.municipio || '';
        }
      }
      if (!phone) {
        phone = this.store.fone1() || '';
      }
    } catch {
      // ignore
    }

    const lines: string[] = [
      'Olá! Adquiri o Suporte Completo no app Simulado CNH do Brasil e gostaria de atendimento.'
    ];

    if (name) {
      lines.push(`👤 Aluno: ${name}`);
    }
    if (phone) {
      lines.push(`📱 WhatsApp: ${phone}`);
    }
    if (municipio || uf) {
      const loc = [municipio, uf].filter(Boolean).join(' - ');
      lines.push(`📍 Localidade: ${loc}`);
    }

    lines.push('Preciso de orientação sobre as etapas da minha CNH.');

    return lines.join('\n\n');
  }

  async openWhatsApp() {
    const text = this.getWhatsAppMessage();
    const phone = '551151924353';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    try {
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      console.warn('Erro ao abrir link do WhatsApp:', e);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

}
