
import { Injectable, signal } from '@angular/core';

export interface OnboardingData {
  processo_iniciado?: string;
  metodo_estudo?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  public showChat = signal<boolean>(true);
  public pushPermission = signal<'prompt' | 'prompt-with-rationale' | 'granted' | 'denied' | null>(null);
  public fone1 = signal<string | null>(null);
  public pushDeclinedIos = signal<boolean>(localStorage.getItem('pushDeclinedIos') === 'true');
  public onboardingData = signal<OnboardingData | null>(null);

  constructor() {
    this.loadOnboardingData();
  }

  public loadOnboardingData() {
    try {
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const parsed = JSON.parse(data);
        this.onboardingData.set({
          processo_iniciado: parsed.processo_iniciado || parsed.onboard?.processo_iniciado || parsed.onboarding?.processo_iniciado || localStorage.getItem('processo_iniciado') || undefined,
          metodo_estudo: parsed.metodo_estudo || parsed.onboard?.metodo_estudo || parsed.onboarding?.metodo_estudo || localStorage.getItem('metodo_estudo') || undefined,
          ...parsed.onboard,
          ...parsed.onboarding
        });
      } else {
        const proc = localStorage.getItem('processo_iniciado');
        const met = localStorage.getItem('metodo_estudo');
        if (proc || met) {
          this.onboardingData.set({
            processo_iniciado: proc || undefined,
            metodo_estudo: met || undefined
          });
        }
      }
    } catch {
      // ignore
    }
  }

}
