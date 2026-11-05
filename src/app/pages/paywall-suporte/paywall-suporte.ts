import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, inject } from '@angular/core';
import { AppStoreService } from '../../app-store.service';

@Component({
  selector: 'app-paywall-suporte',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col items-center justify-center min-h-screen font-sans">
      <!-- Tela paywall-suporte em branco -->
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

