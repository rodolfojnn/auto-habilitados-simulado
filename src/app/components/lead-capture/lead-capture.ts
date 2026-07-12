import { Component, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject } from '@angular/core';
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

          <button (click)="nextStep()" class="w-full bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider">
            Quero participar
          </button>
        </div>
      } @else {
        <div class="animate-fade-in-up flex flex-col gap-6">
          <div class="flex items-center gap-4 mb-2 mt-2">
              <button type="button" [class.invisible]="step() === 1" (click)="prevStep()" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <mat-icon class="material-icons !leading-none">arrow_back_ios_new</mat-icon>
             </button>
             <div class="flex-1 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-brand-500 transition-all duration-300 ease-out" [style.width.%]="(step() / 2) * 100"></div>
             </div>
             <span class="text-xs font-bold text-gray-500">{{ step() }}/2</span>
          </div>

          <form [formGroup]="leadForm" (ngSubmit)="submitLead()" class="flex flex-col gap-6">

            @if (step() === 1) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Como podemos te chamar?</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Este será seu nome exibido.</p>
                <input type="text" formControlName="nome" placeholder="Seu nome" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
              </div>
            }

            @if (step() === 2) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Seu CEP</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Para montarmos as ligas de ranking por região.</p>
                <input type="tel" formControlName="cep" (input)="cepError.set(null)" mask="00000-000" placeholder="00000-000" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg" [class.border-rose-500]="!!cepError()" [class.border-gray-200]="!cepError()" [class.dark:border-slate-700]="!cepError()">
                @if (cepError()) {
                  <p class="text-sm font-medium text-rose-500 mt-1 flex items-center gap-1">
                    <mat-icon class="material-icons !text-sm !w-4 !h-4 !leading-none">error</mat-icon>
                    {{ cepError() }}
                  </p>
                }
              </div>
            }

            @if (step() === 2) {
              <button type="submit" [disabled]="!isCurrentStepValid() || submitting() || cepLoading()" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2">
                @if (submitting() || cepLoading()) {
                  <mat-icon class="material-icons animate-spin !text-xl !w-5 !h-5 !leading-none">refresh</mat-icon>
                  <span>{{ cepLoading() ? 'Validando...' : 'Enviando...' }}</span>
                } @else {
                  <span>Acessar</span>
                }
              </button>
            } @else {
              <button type="button" (click)="nextStep()" [disabled]="!isCurrentStepValid()" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2">
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
export class LeadCaptureComponent {
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

  leadForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fone1: new FormControl(''),
    email: new FormControl(''),
    cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
    municipio: new FormControl(''),
    uf: new FormControl(''),
    solicitacao: new FormControl('')
  });

  nextStep() {
    this.step.update(v => v + 1);
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update(v => v - 1);
    }
  }

  isCurrentStepValid(): boolean {
    const currentStep = this.step();
    if (currentStep === 1) return this.leadForm.get('nome')?.valid ?? false;
    if (currentStep === 2) return this.leadForm.get('cep')?.valid ?? false;
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

        answers['lead_data'] = this.leadForm.value;
        answers['lead_captured'] = true;

        localStorage.setItem('onboarding_answers', JSON.stringify(answers));

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
