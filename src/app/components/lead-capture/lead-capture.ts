import { Component, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Simulado } from '../../simulado';
import { AppStoreService } from '../../app-store.service';
import { PushService } from '../../push.service';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col font-sans">
      @if (step() === 0) {
        <div class="animate-fade-in-up flex flex-col items-center justify-center text-center pb-8">
          <div [class]="'w-20 h-20 rounded-full flex items-center justify-center mb-6 ' + iconBgClass + ' ' + iconTextClass">
            <mat-icon class="material-icons !text-4xl !w-10 !h-10 !leading-none">{{ icon }}</mat-icon>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ title }}</h1>
          <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            {{ description }}
          </p>

          <div class="mb-8 w-full text-left">
             <ng-content></ng-content>
          </div>

          <button (click)="nextStep()" class="w-full bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider cursor-pointer">
            Quero participar
          </button>
        </div>
      } @else {
        <div class="animate-fade-in-up flex flex-col gap-6">
          <div class="flex items-center gap-4 mb-2 mt-2">
              <button type="button" [class.invisible]="step() === 1" (click)="prevStep()" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                <mat-icon class="material-icons !leading-none">arrow_back_ios_new</mat-icon>
             </button>
             <div class="flex-1 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-brand-500 transition-all duration-300 ease-out" [style.width.%]="(step() / 3) * 100"></div>
             </div>
             <span class="text-xs font-bold text-gray-500">{{ step() }}/3</span>
          </div>

          <form [formGroup]="leadForm" (ngSubmit)="handleFormSubmit()" class="flex flex-col gap-6">

            @if (step() === 1) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Como podemos te chamar?</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Este será seu nome exibido.</p>
                <input type="text" formControlName="nome" placeholder="Seu nome completo" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
              </div>
            }

            @if (step() === 2) {
              <div class="animate-fade-in-up flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Qual seu WhatsApp?</h2>
                  <p class="text-gray-500 dark:text-slate-400 text-sm">Para avisos sobre o simulado, novidades e suporte.</p>
                </div>

                <div>
                  <input
                    type="tel"
                    formControlName="fone1"
                    mask="(00) 00000-0000"
                    placeholder="(11) 99999-9999"
                    class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <!-- Checkbox atraente para autorização de contato para aulas práticas -->
                <label
                  class="group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none"
                  [class.border-brand-500]="autorizaInstrutores()"
                  [class.bg-brand-500/5]="autorizaInstrutores()"
                  [class.dark:bg-emerald-500/10]="autorizaInstrutores()"
                  [class.shadow-sm]="autorizaInstrutores()"
                  [class.border-gray-200]="!autorizaInstrutores()"
                  [class.dark:border-slate-700]="!autorizaInstrutores()"
                  [class.bg-gray-50/70]="!autorizaInstrutores()"
                  [class.dark:bg-slate-800/60]="!autorizaInstrutores()"
                  [class.hover:border-brand-400/60]="!autorizaInstrutores()"
                >
                  <div class="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      formControlName="autoriza_contato_instrutor"
                      (change)="onAutorizaToggle($event)"
                      class="sr-only"
                    />
                    <div
                      class="w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200"
                      [class.bg-brand-500]="autorizaInstrutores()"
                      [class.border-brand-500]="autorizaInstrutores()"
                      [class.border-gray-300]="!autorizaInstrutores()"
                      [class.dark:border-slate-600]="!autorizaInstrutores()"
                      [class.bg-white]="!autorizaInstrutores()"
                      [class.dark:bg-slate-900]="!autorizaInstrutores()"
                    >
                      @if (autorizaInstrutores()) {
                        <mat-icon class="material-icons !text-sm !w-3.5 !h-3.5 text-slate-950 font-black !leading-none">check</mat-icon>
                      }
                    </div>
                  </div>

                  <div class="flex-1 flex flex-col text-left">
                    <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span class="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/20 flex items-center gap-0.5 px-2 py-0.5 rounded">
                        <mat-icon class="material-icons !text-xs !w-3 !h-3 !leading-none">local_offer</mat-icon>
                        OFERTAS EXCLUSIVAS
                      </span>
                    </div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                      Quero ofertas para aulas práticas
                    </span>
                    <p class="text-xs text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Receba oportunidades para economizar nas aulas práticas em sua região pelo WhatsApp.
                    </p>
                  </div>
                </label>
              </div>
            }

            @if (step() === 3) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Seu CEP</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Para montarmos as ligas de ranking por região.</p>
                <input type="tel" formControlName="cep" (input)="cepError.set(null)" mask="00000-000" placeholder="00000-000" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg placeholder:text-gray-400 dark:placeholder:text-slate-500" [class.border-rose-500]="!!cepError()" [class.border-gray-200]="!cepError()" [class.dark:border-slate-700]="!cepError()">
                @if (cepError()) {
                  <p class="text-sm font-medium text-rose-500 mt-1 flex items-center gap-1">
                    <mat-icon class="material-icons !text-sm !w-4 !h-4 !leading-none">error</mat-icon>
                    {{ cepError() }}
                  </p>
                }
              </div>
            }

            @if (step() === 3) {
              <button type="submit" [disabled]="!isCurrentStepValid() || submitting() || cepLoading()" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer">
                @if (submitting() || cepLoading()) {
                  <mat-icon class="material-icons animate-spin !text-xl !w-5 !h-5 !leading-none">refresh</mat-icon>
                  <span>{{ cepLoading() ? 'Validando...' : 'Enviando...' }}</span>
                } @else {
                  <span>Acessar</span>
                }
              </button>
            } @else {
              <button type="button" (click)="nextStep()" [disabled]="!isCurrentStepValid()" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer">
                <span>Continuar</span>
              </button>
            }

          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LeadCaptureComponent implements OnInit {
  @Input() title = 'Completar Cadastro';
  @Input() description = 'Precisamos de algumas informações para continuar.';
  @Input() icon = 'person_add';
  @Input() iconBgClass = 'bg-amber-50 dark:bg-amber-500/20';
  @Input() iconTextClass = 'text-amber-500';

  @Output() captured = new EventEmitter<void>();

  private simulado = inject(Simulado);
  private store = inject(AppStoreService);
  private pushService = inject(PushService);

  step = signal<number>(1);
  cepLoading = signal<boolean>(false);
  cepError = signal<string | null>(null);
  submitting = signal<boolean>(false);
  autorizaInstrutores = signal<boolean>(false);

  leadForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fone1: new FormControl('', [Validators.required, Validators.minLength(10)]),
    autoriza_contato_instrutor: new FormControl(false),
    email: new FormControl(''),
    cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
    municipio: new FormControl(''),
    uf: new FormControl(''),
    solicitacao: new FormControl('')
  });

  ngOnInit() {
    try {
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const parsed = JSON.parse(data);
        const lead = (parsed['lead_data'] || parsed) as Record<string, unknown> | undefined;
        if (lead) {
          if (typeof lead['nome'] === 'string' && lead['nome']) {
            this.leadForm.patchValue({ nome: lead['nome'] });
          }
          if (typeof lead['fone1'] === 'string' && lead['fone1']) {
            this.leadForm.patchValue({ fone1: lead['fone1'] });
          }
          if (typeof lead['cep'] === 'string' && lead['cep']) {
            this.leadForm.patchValue({ cep: lead['cep'] });
          }
        }
      }
    } catch {
      // ignore
    }
  }

  onAutorizaToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.autorizaInstrutores.set(checked);
    this.leadForm.get('autoriza_contato_instrutor')?.setValue(checked);
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.step.update(v => v + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update(v => v - 1);
    }
  }

  handleFormSubmit() {
    if (this.step() < 3) {
      this.nextStep();
    } else {
      this.submitLead();
    }
  }

  isCurrentStepValid(): boolean {
    const currentStep = this.step();
    if (currentStep === 1) return this.leadForm.get('nome')?.valid ?? false;
    if (currentStep === 2) {
      const fone = (this.leadForm.get('fone1')?.value || '').toString().replace(/\D/g, '');
      return fone.length >= 10 && fone.length <= 11;
    }
    if (currentStep === 3) return this.leadForm.get('cep')?.valid ?? false;
    return true;
  }

  async submitLead() {
    if (!this.isCurrentStepValid()) return;
    if (this.submitting() || this.cepLoading()) return;

    // Validate CEP first
    const cepValueRaw = this.leadForm.get('cep')?.value || '';
    const cepValue = cepValueRaw.replace(/\D/g, '');

    if (cepValue.length === 8) {
      this.cepLoading.set(true);
      this.cepError.set(null);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        if (!res.ok) throw new Error('Erro na requisição');
        const data = await res.json();

        if (data.erro) {
          this.cepError.set('CEP não encontrado.');
          this.cepLoading.set(false);
          return;
        }

        this.leadForm.patchValue({
          municipio: data.localidade,
          uf: data.uf
        });
      } catch {
        this.cepError.set('Erro ao buscar o CEP. Tente novamente.');
        this.cepLoading.set(false);
        return;
      } finally {
        this.cepLoading.set(false);
      }
    } else {
      this.cepError.set('CEP inválido.');
      return;
    }

    if (this.leadForm.valid && !this.submitting()) {
      this.submitting.set(true);
      try {
        const data = localStorage.getItem('onboarding_answers');
        let answers: Record<string, unknown> = {};
        if (data) {
          try {
            answers = JSON.parse(data) as Record<string, unknown>;
          } catch {
            // ignore parse error
          }
        }

        const formVal = this.leadForm.value;
        const processoIniciado = answers['processo_iniciado'] || (answers['onboard'] as Record<string, unknown> | undefined)?.['processo_iniciado'] || localStorage.getItem('processo_iniciado') || null;
        const metodoEstudo = answers['metodo_estudo'] || (answers['onboard'] as Record<string, unknown> | undefined)?.['metodo_estudo'] || localStorage.getItem('metodo_estudo') || null;

        const existingOnboard = (typeof answers['onboard'] === 'object' && answers['onboard']) ? (answers['onboard'] as Record<string, unknown>) : {};
        const onboardData: Record<string, unknown> = {
          ...existingOnboard,
          processo_iniciado: processoIniciado,
          metodo_estudo: metodoEstudo
        };

        answers['processo_iniciado'] = processoIniciado;
        answers['metodo_estudo'] = metodoEstudo;
        answers['onboard'] = onboardData;
        delete answers['onboarding'];

        answers['lead_data'] = {
          ...formVal,
          processo_iniciado: processoIniciado,
          metodo_estudo: metodoEstudo,
          onboard: onboardData
        };

        answers['nome'] = formVal.nome;
        answers['cep'] = formVal.cep;
        answers['municipio'] = formVal.municipio;
        answers['uf'] = formVal.uf;
        answers['fone1'] = formVal.fone1;
        answers['email'] = formVal.email;
        answers['autoriza_contato_instrutor'] = !!formVal.autoriza_contato_instrutor;
        answers['autoriza_aulas_praticas'] = !!formVal.autoriza_contato_instrutor;
        answers['lead_captured'] = true;

        localStorage.setItem('onboarding_answers', JSON.stringify(answers));

        if (formVal.fone1) {
          const digits = (formVal.fone1 as string || '').replace(/\D/g, '');
          this.store.fone1.set(digits);
        }
        this.store.loadOnboardingData();

        // Espera enviar o lead
        console.log('Sending newLead com dados:', answers);
        await this.simulado.postLead(answers);
        console.log('newLead sent');

        // Pede push notification ANTES de fechar a view, se necessário
        console.log('Initing push token...');
        await this.pushService.initPush();

        // Emite o evento logo após salvar o lead e pedir o push
        this.captured.emit();
      } finally {
        this.submitting.set(false);
      }
    }
  }
}
