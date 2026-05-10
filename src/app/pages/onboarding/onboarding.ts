import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Option {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: Option[];
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 bg-gray-50 dark:bg-slate-900 flex flex-col font-sans">

      <!-- Header / Progress bar -->
      <div class="px-6 pt-8 pb-4 flex items-center justify-between gap-4">
        <button (click)="goBack()" [disabled]="currentStep() === 0" class="text-gray-400 disabled:opacity-0 transition-opacity">
          <mat-icon class="material-icons !leading-none">arrow_back_ios_new</mat-icon>
        </button>

        <div class="flex-1 h-3 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-brand-500 transition-all duration-300 ease-out" [style.width.%]="progress()"></div>
        </div>

        <div class="w-6 h-6"></div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
        @if (currentQuestion(); as q) {
          <div class="animate-fade-in-up flex-1 flex flex-col">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{{ q.title }}</h1>
            <p class="text-gray-500 dark:text-slate-400 mt-2 text-sm">{{ q.subtitle }}</p>

            <div class="mt-8 flex flex-col gap-4">
              @for (opt of q.options; track opt.value) {
                <button
                  (click)="selectOption(opt.value)"
                  [class.border-brand-500]="answers()[q.id] === opt.value"
                  [class.bg-brand-50]="answers()[q.id] === opt.value"
                  [class.dark:bg-emerald-500/10]="answers()[q.id] === opt.value"
                  [class.border-gray-200]="answers()[q.id] !== opt.value"
                  [class.dark:border-white/5]="answers()[q.id] !== opt.value"
                  [class.bg-white]="answers()[q.id] !== opt.value"
                  [class.dark:bg-slate-800]="answers()[q.id] !== opt.value"
                  class="flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all hover:border-brand-300 dark:hover:border-brand-500/50"
                >
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" [class]="opt.color">
                    <mat-icon class="material-icons !text-3xl !w-8 !h-8 !leading-none">{{ opt.icon }}</mat-icon>
                  </div>
                  <span class="flex-1 font-semibold text-lg text-gray-900 dark:text-gray-100">{{ opt.label }}</span>
                </button>
              }
            </div>
          </div>
        }
      </div>

      <!-- Footer / Action -->
      <div class="p-6 pb-8 bg-gray-50 dark:bg-slate-900">
        <button
          (click)="nextStep()"
          [disabled]="!hasAnswerForCurrent()"
          class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-5 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider"
        >
          {{ isLastStep() ? 'Concluir' : 'Continuar' }}
        </button>
      </div>

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
export class OnboardingComponent {
  completed = output<Record<string, string>>();

  questions: Question[] = [
    {
      id: 'processo_iniciado',
      title: 'Você já deu entrada no seu processo de CNH no Detran?',
      subtitle: 'Precisamos saber para personalizar o simulado com dicas adequadas ao seu momento.',
      options: [
        { value: 'sim', label: 'Sim', icon: 'check_circle', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
        { value: 'nao', label: 'Não', icon: 'schedule', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
      ]
    },
    {
      id: 'metodo_estudo',
      title: 'Você está fazendo sozinho pelo aplicativo CNH ou já contratou uma autoescola?',
      subtitle: 'Isso nos ajuda a direcionar melhor o conteúdo.',
      options: [
        { value: 'sozinho', label: 'Sozinho', icon: 'smartphone', color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
        { value: 'autoescola', label: 'Autoescola', icon: 'school', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
      ]
    },
    {
      id: 'categoria',
      title: 'Qual a categoria da CNH que você está buscando aprovacão?',
      subtitle: 'Os critérios mudam dependendo do veículo.',
      options: [
        { value: 'carro', label: 'Carro (Categoria B)', icon: 'directions_car', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' },
        { value: 'moto', label: 'Moto (Categoria A)', icon: 'two_wheeler', color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' },
        { value: 'ambos', label: 'Carro e Moto (A/B)', icon: 'commute', color: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400' },
      ]
    },
    {
      id: 'desafio',
      title: 'Qual a sua maior dificuldade ou medo no exame prático?',
      subtitle: 'Vamos focar as dicas para te ajudar a superar isso.',
      options: [
        { value: 'baliza', label: 'Fazer a Baliza', icon: 'compare_arrows', color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' },
        { value: 'embreagem', label: 'Controle de Embreagem (Rampa)', icon: 'terrain', color: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white' },
        { value: 'regras', label: 'Seta e Sinalização', icon: 'rule', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' },
        { value: 'ansiedade', label: 'Nervosismo', icon: 'favorite_border', color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
        { value: 'nenhuma', label: 'Nenhuma / Ainda não sei', icon: 'help_outline', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
      ]
    },
    {
      id: 'tempo_dedicacao',
      title: 'Quantas horas por semana você pretende se dedicar aos simulados?',
      subtitle: 'A constância é a chave para a aprovação.',
      options: [
        { value: 'pouco', label: 'Menos de 1 hora', icon: 'hourglass_empty', color: 'bg-brand-100 text-brand-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
        { value: 'medio', label: '1 a 3 horas', icon: 'hourglass_bottom', color: 'bg-brand-100 text-brand-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
        { value: 'muito', label: 'Mais de 3 horas', icon: 'hourglass_full', color: 'bg-brand-100 text-brand-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
      ]
    }
  ];

  currentStep = signal<number>(0);
  answers = signal<Record<string, string>>({});

  progress = () => ((this.currentStep() + 1) / this.questions.length) * 100;

  currentQuestion = () => this.questions[this.currentStep()];

  isLastStep = () => this.currentStep() === this.questions.length - 1;

  hasAnswerForCurrent(): boolean {
    const q = this.currentQuestion();
    return !!this.answers()[q.id];
  }

  selectOption(value: string) {
    const q = this.currentQuestion();
    this.answers.update(ans => ({ ...ans, [q.id]: value }));
  }

  nextStep() {
    if (!this.hasAnswerForCurrent()) return;

    if (this.isLastStep()) {
      this.completed.emit(this.answers());
    } else {
      this.currentStep.update(v => v + 1);
    }
  }

  goBack() {
    if (this.currentStep() > 0) {
      this.currentStep.update(v => v - 1);
    }
  }
}
