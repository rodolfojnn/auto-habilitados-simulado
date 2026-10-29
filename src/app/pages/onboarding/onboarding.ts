import { Component, ChangeDetectionStrategy, signal, output, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppStoreService } from '../../app-store.service';

interface Option {
  value: string;
  label: string;
  badge?: string;
  description?: string;
  icon: string;
  color: string;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  multiSelect?: boolean;
  options: Option[];
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[100] bg-gray-50 dark:bg-slate-900 flex flex-col font-sans overflow-y-auto">

      <!-- Header / Progress bar -->
      <div class="px-6 pt-8 pb-4 flex items-center justify-between gap-4 max-w-lg mx-auto w-full">
        <button
          type="button"
          (click)="goBack()"
          [disabled]="currentStep() === 0"
          class="text-gray-400 disabled:opacity-0 transition-opacity p-2 -ml-2 rounded-xl hover:text-gray-900 dark:hover:text-white cursor-pointer"
        >
          <mat-icon class="material-icons !leading-none">arrow_back_ios_new</mat-icon>
        </button>

        <div class="flex-1 h-3 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-brand-500 transition-all duration-300 ease-out" [style.width.%]="progress()"></div>
        </div>

        <div class="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-slate-500">
          {{ currentStep() + 1 }}/{{ questions.length }}
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 px-6 py-6 flex flex-col max-w-lg mx-auto w-full">
        @if (currentQuestion(); as q) {
          <div class="animate-fade-in-up flex-1 flex flex-col">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{{ q.title }}</h1>
            <p class="text-gray-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">{{ q.subtitle }}</p>

            @if (q.multiSelect) {
              <!-- Multi-select Question (Select fields for Carro & Moto) -->
              <div class="mt-6 flex flex-col gap-4">

                <!-- Header helper & Select Both toggle -->
                <div class="flex items-center justify-between text-xs px-1 text-gray-500 dark:text-slate-400">
                  <span class="font-medium">Toque para marcar ou desmarcar:</span>
                  <button
                    type="button"
                    (click)="toggleBothCategories(q.id)"
                    class="text-brand-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <mat-icon class="material-icons !text-sm !w-4 !h-4 !leading-none">
                      {{ isBothSelected(q.id) ? 'check_box' : 'library_add_check' }}
                    </mat-icon>
                    <span>{{ isBothSelected(q.id) ? 'Desmarcar ambos' : 'Selecionar os dois' }}</span>
                  </button>
                </div>

                <!-- Selectable Fields -->
                <div class="flex flex-col gap-3.5">
                  @for (opt of q.options; track opt.value) {
                    @let selected = isOptionSelected(q.id, opt.value);
                    <button
                      type="button"
                      (click)="toggleMultiOption(q.id, opt.value)"
                      [class.border-brand-500]="selected"
                      [class.bg-brand-50/80]="selected"
                      [class.dark:bg-emerald-500/10]="selected"
                      [class.shadow-md]="selected"
                      [class.border-gray-200]="!selected"
                      [class.dark:border-white/5]="!selected"
                      [class.bg-white]="!selected"
                      [class.dark:bg-slate-800]="!selected"
                      class="flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all hover:border-brand-300 dark:hover:border-brand-500/50 cursor-pointer shadow-sm active:scale-[0.99] select-none"
                    >
                      <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" [class]="opt.color">
                        <mat-icon class="material-icons !text-3xl !w-8 !h-8 !leading-none">{{ opt.icon }}</mat-icon>
                      </div>

                      <div class="flex-1 flex flex-col min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-lg text-gray-900 dark:text-gray-100">{{ opt.label }}</span>
                          @if (opt.badge) {
                            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                              {{ opt.badge }}
                            </span>
                          }
                        </div>
                        @if (opt.description) {
                          <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{{ opt.description }}</p>
                        }
                      </div>

                      <!-- Select Box Indicator -->
                      <div
                        class="w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0"
                        [class.bg-brand-500]="selected"
                        [class.border-brand-500]="selected"
                        [class.text-slate-950]="selected"
                        [class.border-gray-300]="!selected"
                        [class.dark:border-slate-600]="!selected"
                        [class.bg-white]="!selected"
                        [class.dark:bg-slate-900]="!selected"
                      >
                        @if (selected) {
                          <mat-icon class="material-icons !text-base !w-4 !h-4 !leading-none font-black">check</mat-icon>
                        }
                      </div>
                    </button>
                  }
                </div>

                <!-- Selection Status Feedback -->
                <div class="pt-2 flex justify-center text-center">
                  @if (isBothSelected(q.id)) {
                    <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-emerald-500/15 border border-brand-200 dark:border-emerald-500/30 text-brand-700 dark:text-emerald-400 text-xs font-semibold animate-fade-in-up">
                      <mat-icon class="material-icons !text-sm !w-4 !h-4 !leading-none">verified</mat-icon>
                      <span>Selecionado: Carro e Moto</span>
                    </div>
                  } @else if (isOptionSelected(q.id, 'carro')) {
                    <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-semibold animate-fade-in-up">
                      <mat-icon class="material-icons !text-sm !w-4 !h-4 !leading-none">directions_car</mat-icon>
                      <span>Selecionado: Carro</span>
                    </div>
                  } @else if (isOptionSelected(q.id, 'moto')) {
                    <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold animate-fade-in-up">
                      <mat-icon class="material-icons !text-sm !w-4 !h-4 !leading-none">two_wheeler</mat-icon>
                      <span>Selecionado: Moto</span>
                    </div>
                  } @else {
                    <span class="text-xs text-gray-400 dark:text-slate-500">Selecione Carro, Moto ou ambos para prosseguir</span>
                  }
                </div>

              </div>
            } @else {
              <!-- Single-select Questions (1 and 2) -->
              <div class="mt-8 flex flex-col gap-4">
                @for (opt of q.options; track opt.value) {
                  <button
                    type="button"
                    (click)="selectOption(opt.value)"
                    [class.border-brand-500]="answers()[q.id] === opt.value"
                    [class.bg-brand-50]="answers()[q.id] === opt.value"
                    [class.dark:bg-emerald-500/10]="answers()[q.id] === opt.value"
                    [class.border-gray-200]="answers()[q.id] !== opt.value"
                    [class.dark:border-white/5]="answers()[q.id] !== opt.value"
                    [class.bg-white]="answers()[q.id] !== opt.value"
                    [class.dark:bg-slate-800]="answers()[q.id] !== opt.value"
                    class="flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all hover:border-brand-300 dark:hover:border-brand-500/50 cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" [class]="opt.color">
                      <mat-icon class="material-icons !text-3xl !w-8 !h-8 !leading-none">{{ opt.icon }}</mat-icon>
                    </div>
                    <span class="flex-1 font-semibold text-lg text-gray-900 dark:text-gray-100">{{ opt.label }}</span>
                    @if (answers()[q.id] === opt.value) {
                      <div class="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-slate-950 shrink-0">
                        <mat-icon class="material-icons !text-base !w-4 !h-4 !leading-none font-black">check</mat-icon>
                      </div>
                    }
                  </button>
                }
              </div>
            }

          </div>
        }
      </div>

      <!-- Footer / Action -->
      <div class="p-6 pb-8 bg-gray-50 dark:bg-slate-900 max-w-lg mx-auto w-full">
        <button
          type="button"
          (click)="nextStep()"
          [disabled]="!hasAnswerForCurrent()"
          class="w-full bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 text-slate-950 font-bold py-5 rounded-full text-lg shadow-lg shadow-brand-500/20 transition-all uppercase tracking-wider cursor-pointer"
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
  completed = output<Record<string, unknown>>();

  questions: Question[] = [
    {
      id: 'processo_iniciado',
      title: 'Você já deu entrada no seu processo de CNH no Detran?',
      subtitle: 'Isso nos ajuda a trazer dicas exclusivas para facilitar cada fase da sua jornada rumo à CNH.',
      options: [
        { value: 'sim', label: 'Sim', icon: 'check_circle', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
        { value: 'nao', label: 'Não', icon: 'schedule', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
      ]
    },
    {
      id: 'metodo_estudo',
      title: 'Você está fazendo sozinho ou contratou uma autoescola?',
      subtitle: 'Isso nos ajuda a direcionar melhor o conteúdo.',
      options: [
        { value: 'sozinho', label: 'Sozinho', icon: 'smartphone', color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
        { value: 'autoescola', label: 'Autoescola', icon: 'school', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
      ]
    },
    {
      id: 'categorias_interesse',
      title: 'Quais categorias você tem interesse em habilitar?',
      subtitle: 'Selecione Carro, Moto ou ambos.',
      multiSelect: true,
      options: [
        {
          value: 'carro',
          label: 'Carro',
          badge: 'Categoria B',
          description: '',
          icon: 'directions_car',
          color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
        },
        {
          value: 'moto',
          label: 'Moto',
          badge: 'Categoria A',
          description: '',
          icon: 'two_wheeler',
          color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
        }
      ]
    }
  ];

  currentStep = signal<number>(0);
  answers = signal<Record<string, unknown>>({});

  progress = computed(() => ((this.currentStep() + 1) / this.questions.length) * 100);
  currentQuestion = computed(() => this.questions[this.currentStep()]);
  isLastStep = computed(() => this.currentStep() === this.questions.length - 1);

  private store = inject(AppStoreService);

  constructor() {
    this.loadSavedAnswers();
  }

  loadSavedAnswers() {
    try {
      const data = localStorage.getItem('onboarding_answers');
      if (data) {
        const parsed = JSON.parse(data);
        const initialAnswers: Record<string, unknown> = {};
        for (const q of this.questions) {
          const raw = parsed[q.id] ?? parsed.onboard?.[q.id] ?? localStorage.getItem(q.id);
          if (raw !== undefined && raw !== null) {
            if (q.multiSelect) {
              if (Array.isArray(raw)) {
                initialAnswers[q.id] = raw;
              } else if (typeof raw === 'string') {
                try {
                  const arr = JSON.parse(raw);
                  initialAnswers[q.id] = Array.isArray(arr) ? arr : [raw];
                } catch {
                  initialAnswers[q.id] = raw.split(',').map(s => s.trim()).filter(Boolean);
                }
              }
            } else {
              initialAnswers[q.id] = String(raw);
            }
          }
        }
        if (Object.keys(initialAnswers).length > 0) {
          this.answers.set(initialAnswers);
        }
      }
    } catch {
      // ignore
    }
  }

  hasAnswerForCurrent(): boolean {
    const q = this.currentQuestion();
    if (!q) return false;
    const val = this.answers()[q.id];
    if (q.multiSelect) {
      return Array.isArray(val) && val.length > 0;
    }
    return !!val;
  }

  selectOption(value: string) {
    const q = this.currentQuestion();
    this.answers.update(ans => ({ ...ans, [q.id]: value }));
  }

  toggleMultiOption(questionId: string, value: string) {
    this.answers.update(ans => {
      const current = (ans[questionId] as string[]) || [];
      let updated: string[];
      if (current.includes(value)) {
        updated = current.filter(v => v !== value);
      } else {
        updated = [...current, value];
      }
      return { ...ans, [questionId]: updated };
    });
  }

  toggleBothCategories(questionId: string) {
    this.answers.update(ans => {
      const current = (ans[questionId] as string[]) || [];
      const hasBoth = current.includes('carro') && current.includes('moto');
      return {
        ...ans,
        [questionId]: hasBoth ? [] : ['carro', 'moto']
      };
    });
  }

  isOptionSelected(questionId: string, value: string): boolean {
    const ans = this.answers()[questionId];
    if (Array.isArray(ans)) {
      return ans.includes(value);
    }
    return ans === value;
  }

  isBothSelected(questionId: string): boolean {
    const ans = this.answers()[questionId];
    if (Array.isArray(ans)) {
      return ans.includes('carro') && ans.includes('moto');
    }
    return false;
  }

  nextStep() {
    if (!this.hasAnswerForCurrent()) return;

    if (this.isLastStep()) {
      const currentAns = this.answers();
      const rawCategorias = currentAns['categorias_interesse'] ?? currentAns['categorias_pratica'];
      const categoriasArray: string[] = Array.isArray(rawCategorias)
        ? (rawCategorias as string[])
        : (rawCategorias ? [String(rawCategorias)] : ['carro']);

      const finalAnswers: Record<string, unknown> = {
        processo_iniciado: currentAns['processo_iniciado'],
        metodo_estudo: currentAns['metodo_estudo'],
        categorias_interesse: categoriasArray
      };

      try {
        localStorage.setItem('onboarding_completed', 'true');
        for (const [key, val] of Object.entries(finalAnswers)) {
          localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
        }

        // Limpa chaves redundantes antigas do localStorage se existirem
        localStorage.removeItem('categorias_pratica');
        localStorage.removeItem('categorias_pratica_label');
        localStorage.removeItem('categoria_cnh_interesse');
        localStorage.removeItem('categoria_pratica');

        const existingStr = localStorage.getItem('onboarding_answers');
        let data: Record<string, unknown> = {};
        if (existingStr) {
          try { data = JSON.parse(existingStr); } catch {
            // ignore
          }
        }

        delete data['onboarding'];
        delete data['categorias_pratica'];
        delete data['categorias_pratica_label'];
        delete data['categoria_cnh_interesse'];
        delete data['categoria_pratica'];

        data = {
          ...data,
          ...finalAnswers,
          onboard: finalAnswers,
          onboarding_completed: true
        };

        localStorage.setItem('onboarding_answers', JSON.stringify(data));
        this.store.loadOnboardingData();
      } catch (e) {
        console.error('Erro ao salvar onboarding no localStorage:', e);
      }

      this.completed.emit(finalAnswers);
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
