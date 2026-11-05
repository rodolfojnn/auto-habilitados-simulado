import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppStoreService } from '../../app-store.service';

@Component({
  selector: 'app-paywall-suporte',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full max-w-[410px] min-h-screen mx-auto bg-[#f3f9f5] dark:bg-slate-950 font-sans overflow-hidden px-5 pt-5 pb-10 box-border">
      <!-- Brilho decorativo do canto superior direito -->
      <div class="pointer-events-none absolute -top-16 -right-20 w-64 h-64 rounded-full bg-[#d4f5df] dark:bg-emerald-500/10 opacity-70 blur-2xl"></div>

      <!-- Cabeçalho: selo, título, descrição e imagem -->
      <div class="relative z-10 mt-2 flex items-start justify-between gap-3">
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
        <div class="relative shrink-0 w-[130px] h-[130px] rounded-full bg-[#dff5e7] dark:bg-emerald-500/15 flex items-center justify-center">
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

      <!-- Bloco bloqueado: acesso ao WhatsApp -->
      <div class="relative z-10 mt-5 rounded-[22px] bg-[#e8f6ee]/70 dark:bg-emerald-500/5 border border-[#d3eddc] dark:border-white/10 p-3 text-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wide">
          <mat-icon class="material-icons !text-[14px] !w-3.5 !h-3.5 !leading-none">lock</mat-icon>
          Bloqueado
        </span>
        <p class="mt-2 text-[12.5px] text-slate-500 dark:text-slate-400">Disponível após adquirir o suporte completo</p>
        <button type="button" disabled class="mt-3 w-full flex items-center gap-3 px-4 py-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed">
          <mat-icon class="material-icons !text-[24px] !w-6 !h-6 !leading-none">chat</mat-icon>
          <span class="flex-1 text-center text-[14px] font-semibold">Acessar suporte pelo WhatsApp</span>
          <mat-icon class="material-icons !text-[18px] !w-[18px] !h-[18px] !leading-none">lock</mat-icon>
        </button>
      </div>

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

      <!-- Ação principal -->
      <button type="button" class="relative z-10 mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-full bg-gradient-to-r from-[#11873f] to-[#0a6330] text-white font-bold text-[16px] shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-transform">
        <mat-icon class="material-icons !text-[22px] !w-[22px] !h-[22px] !leading-none">credit_card</mat-icon>
        <span>Adquirir suporte completo</span>
        <mat-icon class="material-icons !text-[20px] !w-5 !h-5 !leading-none">arrow_forward</mat-icon>
      </button>
    </div>
  `,
})
export class PaywallSuporteComponent implements OnInit, OnDestroy {
  private store = inject(AppStoreService);

  ngOnInit() {
    // Oculta o floating do chat nesta tela (mesmo padrão usado em simulado/duelo)
    this.store.showChat.set(false);
  }

  ngOnDestroy() {
    // Restaura o floating do chat ao sair da tela
    this.store.showChat.set(true);
  }
}

