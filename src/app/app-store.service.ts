
import { Injectable, signal, computed } from '@angular/core';
import { Capacitor } from '@capacitor/core';

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

  public isPaid = signal<boolean>(this.checkIfPaid());

  private checkIfPaid(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return localStorage.getItem('app_paid') === 'true' || localStorage.getItem('simulado_pago') === 'true';
  }

  public setAppPaid(paid = true) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('app_paid', paid ? 'true' : 'false');
    }
    this.isPaid.set(paid);
  }

  public isAutoescola = computed(() => {
    // Bypass para usuários iOS: sempre retorna false no iOS para não bloquear nenhuma funcionalidade
    if (Capacitor.getPlatform() === 'ios') return false;

    const data = this.onboardingData();
    if (data?.metodo_estudo === 'autoescola') return true;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.getItem('metodo_estudo') === 'autoescola') return true;
      try {
        const rawAnswers = localStorage.getItem('onboarding_answers');
        if (rawAnswers) {
          const parsed = JSON.parse(rawAnswers);
          if (parsed.metodo_estudo === 'autoescola' || parsed.onboard?.metodo_estudo === 'autoescola') {
            return true;
          }
        }
      } catch {
        // ignore
      }
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

  public hasValidOnboarding(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    try {
      let proc = localStorage.getItem('processo_iniciado');
      let met = localStorage.getItem('metodo_estudo');
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const parsed = JSON.parse(data);
        if (!proc) proc = parsed.processo_iniciado || parsed.onboard?.processo_iniciado;
        if (!met) met = parsed.metodo_estudo || parsed.onboard?.metodo_estudo;
      }
      return !!(proc && met);
    } catch {
      return false;
    }
  }

}

