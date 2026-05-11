import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, NgxMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col font-sans">

      @if (!leadCaptured()) {
        @if (step() === 0) {
          <div class="animate-fade-in-up flex flex-col items-center justify-center text-center py-8">
            <div class="w-20 h-20 bg-amber-50 dark:bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <mat-icon class="material-icons !text-4xl !w-10 !h-10 !leading-none">redeem</mat-icon>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Prêmios do Ranking Semanal</h1>
            <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
              Os melhores do nosso simulado podem ganhar prêmios e benefícios exclusivos! Para participar, precisamos de algumas informações para entrar em contato com os vencedores e montar a classificação de acordo com a sua região.
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
                  <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Este será seu nome exibido no ranking.</p>
                  <input type="text" formControlName="nome" placeholder="Seu nome completo" class="w-full bg-white dark:bg-slate-800 border items-center px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-gray-900 dark:text-white text-lg">
                </div>
              }

              @if (step() === 2) {
                <div class="animate-fade-in-up flex flex-col gap-2">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Qual seu WhatsApp?</h2>
                  <p class="text-gray-500 dark:text-slate-400 text-sm mb-4">Caso você ganhe, vamos avisar por lá.</p>
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
                  Acessar Ranking
                </button>
              } @else {
                <button type="button" (click)="nextStep()" [disabled]="!isCurrentStepValid()" class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-4 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider mt-2">
                  Continuar
                </button>
              }

            </form>
          </div>
        }
      } @else {
        <div class="animate-fade-in-up flex flex-col gap-6">
          <header class="mb-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ranking Semanal</h1>
            <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">Dispute o topo com outros alunos</p>
          </header>

          <div class="bg-emerald-500 rounded-3xl p-6 text-slate-950 text-center shadow-lg mb-2 relative overflow-hidden">
            <!-- Decoration -->
            <mat-icon class="material-icons absolute -right-6 -bottom-6 text-emerald-600/50 !text-8xl">emoji_events</mat-icon>

            <p class="text-slate-900/70 text-[10px] font-bold uppercase tracking-widest mb-1">Sua posição</p>
            <div class="text-4xl font-bold">14º</div>
            <p class="text-slate-900/80 mt-2 text-xs font-semibold">+2 posições desde ontem</p>
          </div>

          <div class="flex flex-col gap-3">
            <!-- Top 3 -->
            <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm relative overflow-hidden transition-all">
               <div class="absolute inset-y-0 left-0 w-1 bg-amber-400"></div>
               <div class="flex items-center gap-4 pl-2">
                 <div class="font-bold text-lg text-gray-300 dark:text-slate-600 w-6 text-center">1</div>
                 <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                   <mat-icon class="text-gray-400">person</mat-icon>
                 </div>
                 <div>
                   <h3 class="font-semibold text-gray-900 dark:text-white">Ana Souza</h3>
                   <p class="text-xs text-brand-600 dark:text-emerald-400 font-bold">99 pts</p>
                 </div>
               </div>
            </div>

            <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm relative overflow-hidden transition-all">
               <div class="absolute inset-y-0 left-0 w-1 bg-gray-300"></div>
               <div class="flex items-center gap-4 pl-2">
                 <div class="font-bold text-lg text-gray-300 dark:text-slate-600 w-6 text-center">2</div>
                 <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                   <mat-icon class="text-gray-400">person</mat-icon>
                 </div>
                 <div>
                   <h3 class="font-semibold text-gray-900 dark:text-white">Carlos Lima</h3>
                   <p class="text-xs text-brand-600 dark:text-emerald-400 font-bold">95 pts</p>
                 </div>
               </div>
            </div>

            <div class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex align-center justify-between shadow-sm relative overflow-hidden transition-all">
               <div class="absolute inset-y-0 left-0 w-1 bg-amber-700"></div>
               <div class="flex items-center gap-4 pl-2">
                 <div class="font-bold text-lg text-gray-300 dark:text-slate-600 w-6 text-center">3</div>
                 <div class="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                   <mat-icon class="text-gray-400">person</mat-icon>
                 </div>
                 <div>
                   <h3 class="font-semibold text-gray-900 dark:text-white">Mariana Dias</h3>
                   <p class="text-xs text-brand-600 dark:text-emerald-400 font-bold">92 pts</p>
                 </div>
               </div>
            </div>
          </div>
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
export class RankingComponent implements OnInit {
  leadCaptured = signal<boolean>(false);
  step = signal<number>(0);

  leadForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    whatsapp: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
    categoria: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    this.checkLeadStatus();
  }

  checkLeadStatus() {
    const data = localStorage.getItem('onboarding_answers');
    if (data) {
      try {
        const answers = JSON.parse(data) as Record<string, unknown>;
        if (answers && answers['lead_captured'] === true) {
          this.leadCaptured.set(true);
        }
      } catch {
        // ignore parse error
      }
    }
  }

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
      this.leadCaptured.set(true);
    }
  }
}

