import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LeadCaptureComponent } from '../../components/lead-capture/lead-capture';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [MatIconModule, LeadCaptureComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 pt-0 max-w-lg mx-auto w-full flex flex-col font-sans">
      
      @if (!leadCaptured()) {
        <app-lead-capture
          title="Prêmios do Ranking"
          description="Os melhores do simulado e duelo multiplayer podem ganhar prêmios! Para participar, precisamos de algumas informações para entrar em contato com os vencedores e montar a classificação de acordo com a sua região."
          icon="redeem"
          iconBgClass="bg-amber-50 dark:bg-amber-500/20"
          iconTextClass="text-amber-500 dark:text-amber-400"
          (captured)="leadCaptured.set(true)">
          
          <div class="flex flex-col gap-3 mt-2 mb-4 w-full">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-1">Prêmios Nacionais</h3>
            
            <!-- 1st Place -->
            <div class="flex items-center gap-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl relative overflow-hidden">
              <div class="absolute -right-2 -bottom-2 text-amber-200 dark:text-amber-500/10">
                <mat-icon class="!text-6xl !w-16 !h-16">emoji_events</mat-icon>
              </div>
              <div class="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-amber-400/40 relative z-10">
                <span class="text-base font-black leading-none">1º</span>
              </div>
              <div class="flex flex-col relative z-10">
                <span class="text-amber-700 dark:text-amber-400 font-bold text-sm">Aulas Práticas Grátis</span>
                <span class="text-xs text-amber-600/80 dark:text-amber-400/70 font-medium">Pacote extra com instrutor</span>
              </div>
            </div>

            <!-- 2nd Place -->
            <div class="flex items-center gap-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl relative overflow-hidden">
              <div class="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-white flex flex-col items-center justify-center shrink-0 shadow-lg shadow-slate-400/20 relative z-10">
                <span class="text-base font-black leading-none">2º</span>
              </div>
              <div class="flex flex-col relative z-10">
                <span class="text-slate-700 dark:text-slate-300 font-bold text-sm">Curso Ao Vivo</span>
                <span class="text-xs text-slate-500 font-medium">Revisão com instrutor expert</span>
              </div>
            </div>

            <!-- 3rd Place -->
            <div class="flex items-center gap-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-2xl relative overflow-hidden">
              <div class="w-10 h-10 rounded-full bg-orange-400 text-orange-950 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-orange-400/20 relative z-10">
                <span class="text-base font-black leading-none">3º</span>
              </div>
              <div class="flex flex-col relative z-10">
                <span class="text-orange-700 dark:text-orange-400 font-bold text-sm">Acesso VIP</span>
                <span class="text-xs text-orange-600/80 dark:text-orange-400/70 font-medium">Material de estudo exclusivo</span>
              </div>
            </div>
          </div>
        </app-lead-capture>
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
}

