import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';

@Injectable({
  providedIn: 'root'
})
export class InAppReviewManager {
  /**
   * Aciona o fluxo de avaliação nativa do aplicativo (In-App Review).
   *
   * Comportamento por plataforma:
   * - iOS: Dispara SKStoreReviewController diretamente na interface do app (limite nativo da Apple: até 3 vezes por ano).
   * - Android: Dispara o Google Play In-App Review API diretamente (bottom sheet nativo do Google Play).
   * - Web: Não interrompe a execução caso esteja rodando no navegador/desenvolvimento.
   *
   * Não exibe modal prévio de confirmação, em conformidade com as diretrizes
   * oficiais da Apple e Google que proíbem gates/filtros antes do prompt nativo.
   */
  async requestReview(): Promise<void> {
    const platform = Capacitor.getPlatform();

    if (!Capacitor.isNativePlatform()) {
      console.log(`[InAppReview] Plataforma atual '${platform}' não é nativa. O In-App Review é acionado em dispositivos reais iOS/Android.`);
      return;
    }

    try {
      console.log(`[InAppReview] Solicitando avaliação nativa no ${platform}...`);
      await InAppReview.requestReview();
      console.log(`[InAppReview] Avaliação nativa executada com sucesso no ${platform}.`);
    } catch (err) {
      console.warn(`[InAppReview] Erro ou fluxo indisponível no momento (${platform}):`, err);
    }
  }
}
