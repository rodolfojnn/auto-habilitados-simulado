import { Component, ChangeDetectionStrategy, signal, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-lead-capture',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col font-sans">
      @if (step() === 0) {
        <div class="animate-fade-in-up flex flex-col items-center justify-center text-center py-8">
          <div [class]="'w-20 h-20 rounded-full flex items-center justify-center mb-6 ' + iconBgClass + ' ' + iconTextClass">
            <mat-icon class="material-icons !text-4xl !w-10 !h-10 !leading-none">{{ icon }}</mat-icon>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ title }}</h1>
          <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {{ description }}
          </p>

          <button (click)="nextStep()" class="w-full bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider">
            Quero participar
          </button>
        </div>
      } @else {
        <div class="animate-fade-in-up flex flex-col gap-6">
          <div class="flex items-center gap-4 mb-2 mt-2">
             <button type="button" (click)="prevStep()" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <mat-icon class="material-icons !leading-none">arrow_back_ios_new</mat-icon>
             </button>
             <div class="flex-1 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-brand-500 transition-all duration-300 ease-out" [style.width.%]="(step() / 5) * 100"></div>
             </div>
             <span class="text-xs font-bold text-gray-500">{{ step() }}/5</span>
          </div>

          <form [formGroup]="leadForm" (ngSubmit)="submitLead()" class="flex flex-col gap-6">

            @if (step() === 1) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Como podemos te chamar?</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Este será seu nome exibido.</p>
                <input type="text" formControlName="nome" placeholder="Seu nome completo" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
              </div>
            }

            @if (step() === 2) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Qual seu WhatsApp?</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Caso você ganhe ou para suporte, vamos avisar por lá.</p>
                <input type="tel" formControlName="whatsapp" mask="(00) 00000-0000" placeholder="(11) 99999-9999" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
              </div>
            }

            @if (step() === 3) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Seu melhor E-mail</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Prometemos não mandar spam.</p>
                <input type="email" formControlName="email" placeholder="seu@email.com" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
              </div>
            }

            @if (step() === 4) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Seu CEP</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Para montarmos as ligas de ranking por região.</p>
                <input type="text" formControlName="cep" mask="00000-000" placeholder="00000-000" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
              </div>
            }

            @if (step() === 5) {
              <div class="animate-fade-in-up flex flex-col gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Qual a sua categoria?</h2>
                <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Para disputar com quem está na mesma situação.</p>
                <div class="flex flex-col gap-3">
                  <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all" [class.border-emerald-500]="leadForm.get('categoria')?.value === 'carro'" [class.bg-emerald-50]="leadForm.get('categoria')?.value === 'carro'" [class.dark:bg-emerald-500/10]="leadForm.get('categoria')?.value === 'carro'" [class.border-gray-200]="leadForm.get('categoria')?.value !== 'carro'" [class.dark:border-slate-700]="leadForm.get('categoria')?.value !== 'carro'" [class.dark:bg-slate-800]="leadForm.get('categoria')?.value !== 'carro'">
                    <input type="radio" formControlName="categoria" value="carro" class="hidden">
                    <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                       <mat-icon class="material-icons">directions_car</mat-icon>
                    </div>
                    <span class="font-semibold text-lg text-gray-900 dark:text-white">Aulas de Carro (B)</span>
                  </label>

                  <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all" [class.border-emerald-500]="leadForm.get('categoria')?.value === 'moto'" [class.bg-emerald-50]="leadForm.get('categoria')?.value === 'moto'" [class.dark:bg-emerald-500/10]="leadForm.get('categoria')?.value === 'moto'" [class.border-gray-200]="leadForm.get('categoria')?.value !== 'moto'" [class.dark:border-slate-700]="leadForm.get('categoria')?.value !== 'moto'" [class.dark:bg-slate-800]="leadForm.get('categoria')?.value !== 'moto'">
                    <input type="radio" formControlName="categoria" value="moto" class="hidden">
                    <div class="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                       <mat-icon class="material-icons">two_wheeler</mat-icon>
                    </div>
                    <span class="font-semibold text-lg text-gray-900 dark:text-white">Aulas de Moto (A)</span>
                  </label>

                  <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all" [class.border-emerald-500]="leadForm.get('categoria')?.value === 'carro_moto'" [class.bg-emerald-50]="leadForm.get('categoria')?.value === 'carro_moto'" [class.dark:bg-emerald-500/10]="leadForm.get('categoria')?.value === 'carro_moto'" [class.border-gray-200]="leadForm.get('categoria')?.value !== 'carro_moto'" [class.dark:border-slate-700]="leadForm.get('categoria')?.value !== 'carro_moto'" [class.dark:bg-slate-800]="leadForm.get('categoria')?.value !== 'carro_moto'">
                    <input type="radio" formControlName="categoria" value="carro_moto" class="hidden">
                    <div class="w-12 h-12 bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0">
                       <mat-icon class="material-icons">commute</mat-icon>
                    </div>
                    <span class="font-semibold text-lg text-gray-900 dark:text-white">Aulas de Carro e Moto</span>
                  </label>
                </div>
              </div>
            }

            @if (step() === 5) {
              <button type="submit" [disabled]="leadForm.invalid" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2">
                Acessar
              </button>
            } @else {
              <button type="button" (click)="nextStep()" [disabled]="!isCurrentStepValid()" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2">
                Continuar
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

  step = signal<number>(0);

  leadForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    whatsapp: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
    categoria: new FormControl('', [Validators.required])
  });

  nextStep() {
    this.step.update(v => v + 1);
  }

  prevStep() {
    if (this.step() > 0) {
      this.step.update(v => v - 1);
    }
  }

  isCurrentStepValid(): boolean {
    const currentStep = this.step();
    if (currentStep === 1) return this.leadForm.get('nome')?.valid ?? false;
    if (currentStep === 2) return this.leadForm.get('whatsapp')?.valid ?? false;
    if (currentStep === 3) return this.leadForm.get('email')?.valid ?? false;
    if (currentStep === 4) return this.leadForm.get('cep')?.valid ?? false;
    return true; // For step 0
  }

  submitLead() {
    if (this.leadForm.valid) {
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
      this.captured.emit();
    }
  }
}
