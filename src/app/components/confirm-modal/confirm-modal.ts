import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="onCancel()"></div>

        <!-- Modal -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-scale-in">
          <div class="p-6 sm:p-8 flex flex-col gap-4">
            
            <div class="flex items-start gap-4">
              @if (icon) {
                <div [class]="'w-12 h-12 rounded-full flex items-center justify-center shrink-0 ' + iconBgClass + ' ' + iconTextClass">
                  <mat-icon class="material-icons !text-2xl !w-6 !h-6 !leading-6">{{ icon }}</mat-icon>
                </div>
              }
              
              <div class="flex flex-col gap-2 pt-1">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ title }}</h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {{ description }}
                </p>
              </div>
            </div>

            <div class="flex sm:flex-row flex-col items-center gap-3 w-full mt-4">
              @if (showCancelButton) {
                <button 
                  (click)="onCancel()"
                  class="w-full sm:w-auto flex-1 px-4 py-3 rounded-2xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                  {{ cancelText }}
                </button>
              }
              
              <button 
                (click)="onConfirm()"
                [class]="'w-full sm:w-auto flex-1 px-4 py-3 rounded-2xl font-bold text-white transition-colors shadow-lg ' + confirmButtonClasses">
                {{ confirmText }}
              </button>
            </div>
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
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar Ação';
  @Input() description = 'Você tem certeza que deseja realizar esta ação?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancelButton = true;
  @Input() icon = 'warning';
  @Input() iconBgClass = 'bg-rose-100 dark:bg-rose-500/20';
  @Input() iconTextClass = 'text-rose-600 dark:text-rose-400';
  @Input() confirmButtonClasses = 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
