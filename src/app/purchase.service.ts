import { Injectable, signal, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStoreService } from './app-store.service';

interface CdvPurchaseError {
  isError?: boolean;
  code?: number;
  message?: string;
}

interface CdvPurchaseOffer {
  id?: string;
}

interface CdvPurchaseProduct {
  id: string;
  owned?: boolean;
  canPurchase?: boolean;
  getOffer(): CdvPurchaseOffer | undefined;
}

interface CdvPurchaseTransaction {
  id?: string;
  productId?: string;
  products?: { id?: string; productId?: string }[];
  parentReceipt?: {
    items?: { id?: string }[];
  };
  finish(): void;
}

interface CdvPurchaseReceipt {
  transactions?: CdvPurchaseTransaction[];
  hasOrHadProduct?(productId: string): boolean;
}

interface CdvPurchaseWhen {
  productUpdated(cb: (product: CdvPurchaseProduct) => void): void;
  receiptUpdated(cb: (receipt: CdvPurchaseReceipt) => void): void;
  receiptsReady(cb: () => void): void;
  approved(cb: (transaction: CdvPurchaseTransaction) => void): void;
}

interface CdvPurchaseStore {
  verbosity: number;
  register(products: { id: string; type: string; platform: string }[]): void;
  when(): CdvPurchaseWhen;
  ready(cb: () => void): void;
  initialize(platforms: string[]): Promise<CdvPurchaseError[] | void> | void;
  get(id: string): CdvPurchaseProduct | undefined;
  order(target: CdvPurchaseOffer | CdvPurchaseProduct): Promise<CdvPurchaseError | undefined>;
  restorePurchases(): Promise<CdvPurchaseError | undefined>;
}

interface CdvPurchaseNamespace {
  store: CdvPurchaseStore;
  ProductType: {
    CONSUMABLE: string;
    NON_CONSUMABLE: string;
  };
  Platform: {
    APPLE_APPSTORE: string;
    GOOGLE_PLAY: string;
  };
  LogLevel: {
    QUIET: number;
  };
  ErrorCode?: {
    PAYMENT_CANCELLED?: number;
  };
}

declare const CdvPurchase: CdvPurchaseNamespace | undefined;

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  isReady = signal(false);
  isProcessingPayment = signal(false);
  isCheckingStatus = signal(false);
  paymentConfirmedJustNow = signal(false);

  private snackBar = inject(MatSnackBar);
  private appStore = inject(AppStoreService);

  initialize() {
    // Enquanto não houver cobrança ativa no iOS, não inicializa a loja (StoreKit) no iPhone
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;

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

    // Registra tanto o produto de doação quanto o produto do simulado
    store.register([
      {
        id: 'mantenha_gratis_5',
        type: ProductType.CONSUMABLE,
        platform: platform,
      },
      {
        id: 'valor_simulado',
        type: ProductType.NON_CONSUMABLE,
        platform: platform,
      }
    ]);

    // Listener de atualização de produto: garante ativação sempre que a posse for confirmada
    store.when().productUpdated((product) => {
      if (product.id === 'valor_simulado' && product.owned) {
        console.log('Produto valor_simulado confirmado como "owned" via productUpdated!');
        this.markPaidSuccess();
      }
    });

    // Listener de recibos atualizados: captura compras prévias ou processadas em background
    store.when().receiptUpdated((receipt) => {
      const hasSimuladoInReceipt =
        (typeof receipt.hasOrHadProduct === 'function' && receipt.hasOrHadProduct('valor_simulado')) ||
        receipt.transactions?.some((t) => t.products?.some((p) => p.id === 'valor_simulado'));

      const simuladoProduct = store.get('valor_simulado');
      if (hasSimuladoInReceipt || (simuladoProduct && simuladoProduct.owned)) {
        console.log('Recibo validou posse de valor_simulado!');
        this.markPaidSuccess();
      }
    });

    // Listener de recibos prontos: quando o Google Play/App Store termina de sincronizar todas as compras passadas
    store.when().receiptsReady(() => {
      console.log('Todos os recibos da loja foram sincronizados.');
      const simuladoProduct = store.get('valor_simulado');
      if (simuladoProduct && simuladoProduct.owned) {
        this.markPaidSuccess();
      }
    });

    // Processar a conclusão e dar o feedback no evento de aprovação
    store.when().approved((transaction) => {
      const isProductInTransaction = (productId: string): boolean =>
        Boolean(
          transaction.products?.some((p) => p.id === productId || p.productId === productId)
          || transaction.parentReceipt?.items?.some((i) => i.id === productId)
          || transaction.id === productId
          || transaction.productId === productId
        );

      const isSimulado = isProductInTransaction('valor_simulado');
      const isDonation = isProductInTransaction('mantenha_gratis_5');

      // Ignora transações que não pertencem aos produtos registrados (ex: recibo do próprio app no iOS)
      if (!isSimulado && !isDonation) {
        return;
      }

      // Finaliza a transação para a loja não reembolsar o usuário
      try {
        transaction.finish();
      } catch (err) {
        console.warn('Erro ao finalizar transação:', err);
      }

      if (isSimulado) {
        this.markPaidSuccess();
        this.snackBar.open('Pagamento confirmado! Acesso ilimitado ao simulado liberado.', 'Fechar', {
          duration: 5000,
          panelClass: ['brand-snackbar']
        });
      } else if (isDonation) {
        // Feedback visual de agradecimento pela doação
        this.snackBar.open('Muito obrigado pela sua doação! Isso nos ajuda a manter o aplicativo gratuito para todos.', 'Fechar', {
          duration: 5000,
          panelClass: ['brand-snackbar']
        });
      }
    });

    store.ready(() => {
      this.isReady.set(true);
      console.log('Purchase store is ready!');

      // Se o usuário já comprou o simulado anteriormente no Google Play, restaura automaticamente
      const simuladoProduct = store.get('valor_simulado');
      if (simuladoProduct && simuladoProduct.owned) {
        this.markPaidSuccess();
      }
    });

    // Inicializa o serviço para a plataforma alvo
    store.initialize([platform]);
  }

  private markPaidSuccess() {
    this.appStore.setAppPaid(true);
    if (this.isProcessingPayment()) {
      this.paymentConfirmedJustNow.set(true);
      this.isCheckingStatus.set(false);
    }
  }

  async donate() {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android' || typeof CdvPurchase === 'undefined') {
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

    const { store, ErrorCode } = CdvPurchase;
    const product = store.get('mantenha_gratis_5');

    if (product) {
      const offer = product.getOffer();
      const target = offer ?? (product.canPurchase ? product : null);
      if (target) {
        try {
          const orderError = await Promise.resolve(store.order(target));
          if (orderError?.isError && orderError.code !== ErrorCode?.PAYMENT_CANCELLED) {
            this.snackBar.open('Não foi possível iniciar a doação. Tente novamente.', 'Fechar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        } catch (err) {
          console.warn('Erro ao iniciar doação:', err);
          this.snackBar.open('Erro ao iniciar a doação. Tente novamente.', 'Fechar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
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

  async buySimulado() {
    // Abre o modal de acompanhamento pós-pagamento imediatamente
    this.isProcessingPayment.set(true);
    this.paymentConfirmedJustNow.set(false);

    // Se já estiver pago localmente ou nos recibos, aprova na hora
    if (this.appStore.isPaid()) {
      this.paymentConfirmedJustNow.set(true);
      return;
    }

    if (!Capacitor.isNativePlatform() || typeof CdvPurchase === 'undefined') {
      // Em ambiente Web / Preview de desenvolvimento: mantém o modal aberto para teste
      return;
    }

    if (Capacitor.getPlatform() !== 'android') {
      this.isProcessingPayment.set(false);
      return;
    }

    if (!this.isReady()) {
      this.isProcessingPayment.set(false);
      this.snackBar.open('A loja ainda não está pronta, por favor aguarde um momento.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const { store, ErrorCode } = CdvPurchase;
    const product = store.get('valor_simulado');

    if (product) {
      const offer = product.getOffer();
      const target = offer ?? (product.canPurchase ? product : null);
      if (target) {
        try {
          const orderError = await Promise.resolve(store.order(target));
          if (orderError?.isError) {
            this.isProcessingPayment.set(false);
            if (orderError.code !== ErrorCode?.PAYMENT_CANCELLED) {
              this.snackBar.open('Não foi possível iniciar o pagamento. Tente novamente.', 'Fechar', {
                duration: 4000,
                panelClass: ['error-snackbar']
              });
            }
          }
        } catch (err) {
          console.warn('Erro ao iniciar compra de valor_simulado:', err);
          this.isProcessingPayment.set(false);
          this.snackBar.open('Erro ao iniciar o pagamento. Tente novamente.', 'Fechar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      } else {
        this.isProcessingPayment.set(false);
        this.snackBar.open('Oferta não disponível no momento.', 'Fechar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.isProcessingPayment.set(false);
      this.snackBar.open('Produto "valor_simulado" não encontrado no Google Play. Verifique sua conexão e tente novamente.', 'Fechar', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
    }
  }

  async verifyPaymentManually() {
    if (this.isCheckingStatus()) return;
    this.isCheckingStatus.set(true);

    try {
      if (this.appStore.isPaid()) {
        this.paymentConfirmedJustNow.set(true);
        return;
      }

      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android' && typeof CdvPurchase !== 'undefined') {
        try {
          const { store } = CdvPurchase;
          await Promise.resolve(store.restorePurchases());

          const simuladoProduct = store.get('valor_simulado');
          if ((simuladoProduct && simuladoProduct.owned) || this.appStore.isPaid()) {
            this.markPaidSuccess();
            return;
          }
        } catch (e) {
          console.warn('Erro ao verificar compras:', e);
        }
      }

      // Delay visual de feedback para a consulta antes de liberar o botão novamente
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      if (this.appStore.isPaid()) {
        this.paymentConfirmedJustNow.set(true);
      }
    } finally {
      this.isCheckingStatus.set(false);
    }
  }

  async restartApp() {
    try {
      await Promise.race([
        this.restorePurchases(),
        new Promise<void>((resolve) => setTimeout(resolve, 2500))
      ]);
    } finally {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  dismissProcessingModal() {
    this.isProcessingPayment.set(false);
    this.paymentConfirmedJustNow.set(false);
    this.isCheckingStatus.set(false);
  }

  async restorePurchases() {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android' || typeof CdvPurchase === 'undefined') return;
    try {
      const { store } = CdvPurchase;
      await Promise.resolve(store.restorePurchases());
    } catch (e) {
      console.warn('Erro ao restaurar compras:', e);
    }
  }
}
