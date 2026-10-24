import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-support-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          (click)="closed.emit()"
          (keydown.enter)="closed.emit()"
          tabindex="0"
        ></div>

        <!-- Modal Box -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-scale-in">

          <!-- Header with Close button -->
          <div class="p-6 pb-0 flex items-start justify-between gap-3">
            <div class="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <mat-icon class="material-icons !text-2xl !w-6 !h-6 !leading-6">contact_support</mat-icon>
            </div>
            <button
              type="button"
              (click)="closed.emit()"
              class="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <mat-icon class="material-icons !text-2xl !w-6 !h-6 !leading-6">close</mat-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-4 flex flex-col gap-4">
            <div>
              <h3 id="support-modal-title" class="text-xl font-bold text-slate-900 dark:text-white">
                Suporte
              </h3>
              <p class="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Nossa equipe está pronta para te atender.
              </p>
            </div>

            <!-- Email box -->
            <div class="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 flex flex-col gap-2.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                E-mail para contato
              </span>
              <div class="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5">
                <span class="text-xs sm:text-sm font-mono font-medium text-slate-800 dark:text-slate-200 break-all select-all">
                  {{ email }}
                </span>
                <button
                  type="button"
                  (click)="copyEmail()"
                  class="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  [class]="copied() ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                >
                  <mat-icon class="material-icons !text-base !w-4 !h-4 !leading-4">
                    {{ copied() ? 'check' : 'content_copy' }}
                  </mat-icon>
                  <span>{{ copied() ? 'Copiado!' : 'Copiar' }}</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Actions -->
          <div class="p-6 pt-2 flex flex-col sm:flex-row items-center gap-2.5 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              (click)="closed.emit()"
              class="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    .animate-scale-in {
      animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class SupportModal {
  isOpen = input<boolean>(false);
  closed = output<void>();

  readonly email = 'simuladocnhdobrasil@dirigiragora.com.br';
  copied = signal<boolean>(false);

  copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(this.email).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2500);
      }).catch(() => {
        this.fallbackCopy();
      });
    } else {
      this.fallbackCopy();
    }
  }

  private fallbackCopy(): void {
    if (typeof document === 'undefined') return;
    try {
      const textarea = document.createElement('textarea');
      textarea.value = this.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      // ignore
    }
  }
}
