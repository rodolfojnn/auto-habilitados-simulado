import { Injectable, signal, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const CdvPurchase: any;

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  isReady = signal(false);
  private snackBar = inject(MatSnackBar);

  initialize() {
    if (!Capacitor.isNativePlatform()) return;

    // No Capacitor, executamos o setup diretamente (sem depender do listener 'deviceready')
    this.setupStore();
  }

  private setupStore() {
    if (typeof CdvPurchase === 'undefined') {
      console.warn('CdvPurchase not available. Ensure cordova-plugin-purchase is correctly installed.');
      return;
    }

    const { store, ProductType, Platform, LogLevel } = CdvPurchase;

    store.verbosity = LogLevel.QUIET;

    const platform = Capacitor.getPlatform() === 'ios' ? Platform.APPLE_APPSTORE : Platform.GOOGLE_PLAY;

    // FIX 1: Passar o produto envolto em um Array [...]
    store.register([{
      id: 'mantenha_gratis_5',
      type: ProductType.CONSUMABLE,
      platform: platform,
    }]);

    // FIX 2: Processar a conclusão e dar o feedback no evento de aprovação
    store.when().approved((transaction: any) => {
      // Finaliza a transação para o Google não reembolsar o usuário
      transaction.finish();

      // Feedback visual de agradecimento
      this.snackBar.open('Muito obrigado pela sua doação! Isso nos ajuda a manter o aplicativo gratuito para todos.', 'Fechar', {
        duration: 5000,
        panelClass: ['brand-snackbar']
      });
    });

    store.ready(() => {
      this.isReady.set(true);
      console.log('Purchase store is ready!');
    });

    // Inicializa o serviço para a plataforma alvo
    store.initialize([platform]);
  }

  donate() {
    if (!Capacitor.isNativePlatform() || typeof CdvPurchase === 'undefined') {
      this.snackBar.open('A loja de pagamentos só está disponível no aplicativo instalado.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.isReady()) {
      this.snackBar.open('A loja ainda não está pronta, por favor aguarde um momento.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const { store } = CdvPurchase;
    const product = store.get('mantenha_gratis_5');

    if (product) {
      const offer = product.getOffer();
      if (offer) {
        store.order(offer);
      } else if (product.canPurchase) {
        store.order(product);
      } else {
        this.snackBar.open('Oferta não disponível no momento.', 'Fechar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.snackBar.open('Produto não encontrado no Google Play. Verifique sua conexão e tente novamente.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
    }
  }
}