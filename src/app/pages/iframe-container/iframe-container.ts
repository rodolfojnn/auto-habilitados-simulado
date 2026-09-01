import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-iframe-container',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-[100] flex flex-col h-[100dvh] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <!-- Header -->
      <header class="h-14 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 shrink-0 shadow-sm z-10 transition-colors">
        <!-- <h1 class="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Conteúdo</h1> -->
        <button (click)="close()" class="p-2 -mr-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <mat-icon class="material-icons !leading-none block">close</mat-icon>
        </button>
      </header>

      <!-- Iframe Container -->
      <div class="flex-grow w-full relative">
        <iframe
          [src]="iframeUrl"
          class="absolute inset-0 w-full h-full border-none"
          title="Conteúdo Externo"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-top-navigation"
        ></iframe>
      </div>
    </div>
  `
})
export class IframeContainerPage {
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);

  iframeUrl: SafeResourceUrl;

  constructor() {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.dirigiragora.com.br/iframe-container-simulado');
  }

  close() {
    this.location.back();
  }
}
