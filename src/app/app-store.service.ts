
import { Injectable, signal, computed } from '@angular/core';

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

  public isAutoescola = computed(() => {
    const data = this.onboardingData();
    if (data?.metodo_estudo === 'autoescola') return true;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.getItem('metodo_estudo') === 'autoescola') return true;
    }
    return false;
  });

  constructor() {
    this.loadOnboardingData();
  }

  public loadOnboardingData() {
    try {
      const data = localStorage.getItem('onboarding_answers');
      const proc = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('processo_iniciado') || undefined : undefined;
      const met = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('metodo_estudo') || undefined : undefined;

      if (data) {
        const parsed = JSON.parse(data);
        const onboardObj = parsed.onboard || {};
        this.onboardingData.set({
          processo_iniciado: parsed.processo_iniciado || onboardObj.processo_iniciado || proc,
          metodo_estudo: parsed.metodo_estudo || onboardObj.metodo_estudo || met,
          ...onboardObj
        });
      } else if (proc || met) {
        this.onboardingData.set({
          processo_iniciado: proc,
          metodo_estudo: met
        });
      } else {
        this.onboardingData.set(null);
      }
    } catch {
      // ignore
    }
  }

}

