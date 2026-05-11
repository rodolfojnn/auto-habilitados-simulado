import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const TIPS = [
  "Ajuste o banco, os retrovisores e coloque o cinto de segurança antes de ligar o veículo.",
  "Verifique se as portas estão bem fechadas antes de iniciar o percurso.",
  "Sempre sinalize com a seta antes de sair com o carro ou realizar qualquer manobra.",
  "Engate a primeira marcha e abaixe o freio de mão completamente antes de arrancar.",
  "Cuidado para o carro não voltar ao arrancar em aclives (subidas).",
  "Ao parar no semáforo ou cruzamento, mantenha a primeira marcha engatada e o pé no freio.",
  "Não desengrene o veículo (deixar em ponto morto) com ele em movimento.",
  "Atenção constante aos espelhos retrovisores durante todo o percurso.",
  "Respeite rigorosamente os limites de velocidade da via.",
  "Para a baliza, use os pontos de referência que você aprendeu nas aulas.",
  "Na baliza, virar o volante com o carro parado não é falta, aproveite isso a seu favor.",
  "Atenção ao tempo limite para a realização da baliza (se houver no seu estado).",
  "Sinalize com antecedência ao se aproximar do local da baliza.",
  "Ao finalizar a baliza, certifique-se de desengatar a marcha e puxar o freio de mão.",
  "Lembre-se de olhar para trás e usar os retrovisores ao dar marcha a ré.",
  "Mantenha as duas mãos no volante, exceto ao mudar de marcha ou acionar equipamentos.",
  "Não apoie o pé no pedal da embreagem enquanto estiver dirigindo.",
  "Evite movimentos bruscos e frenagens fortes.",
  "Demonstre domínio dos pedais, sincronizando embreagem e acelerador.",
  "Pare completamente o veículo nas placas de 'Pare'. Dar apenas uma 'paradinha' reprova!",
  "Dê a preferência aos pedestres nas faixas de travessia.",
  "Atenção aos cruzamentos não sinalizados: a preferência é de quem vem pela direita.",
  "Ao parar junto à calçada, deixe o veículo alinhado e a uma distância segura do meio-fio.",
  "Não atinja ou suba no meio-fio (guia da calçada) durante as manobras.",
  "Ao fazer curvas, reduza a velocidade e engate a marcha adequada.",
  "Mantenha uma distância de seguimento segura do veículo à frente.",
  "Cuidado com o nervosismo: respire fundo antes de começar. O avaliador sabe que você está sob pressão.",
  "Não deixe o motor morrer. Se acontecer, mantenha a calma, coloque em ponto morto e ligue novamente.",
  "Não transite na contramão de direção, mesmo que por um pequeno trecho.",
  "Obedeça a todas as ordens e sinalizações do examinador.",
  "Atenção redobrada em cruzamentos com linha férrea (pare, olhe e escute).",
  "Use o freio de modo suave e progressivo.",
  "Na saída da baliza, observe o trânsito nos retrovisores e dê a seta.",
  "Não cruze os braços ao virar o volante.",
  "Se o examinador não der nenhuma instrução em um cruzamento, siga reto.",
  "Não tente adivinhar o percurso, ouça atentamente o examinador.",
  "Em caso de chuva, ligue os limpadores de para-brisa.",
  "Nunca use farol alto no perímetro urbano durante a prova.",
  "Cuidado para não usar a buzina sem necessidade.",
  "Mantenha o controle da direção em linha reta, sem 'costurar' na via.",
  "Em ladeiras, não deixe o carro descer nem um pouco antes de arrancar.",
  "Não avance o sinal vermelho do semáforo sob nenhuma circunstância.",
  "Preste atenção à faixa contínua: é proibido ultrapassar ou transpor.",
  "A marcha a ré deve ser usada apenas para pequenas manobras.",
  "Use calçados adequados e que fiquem firmes nos pés (sandálias abertas são proibidas).",
  "Não desengate o veículo em declives (não ande na 'banguela').",
  "Ao terminar o exame, desligue o motor, deixe o carro engatado (1ª marcha) e puxe o freio de mão.",
  "Demonstre confiança de que domina o veículo.",
  "Não interrompa o funcionamento do motor sem justa razão.",
  "Lembre-se: errar uma manobra não significa reprovação automática, se não for eliminatória. Continue concentrado!"
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 font-sans">

      <!-- User Greeting / Hero -->
      <header class="flex flex-col gap-1">
        <p class="text-[10px] uppercase tracking-widest text-brand-600 dark:text-slate-400 font-bold">Bem-vindo(a) de volta!</p>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pronto para a sua CNH?</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm">Pratique e melhore suas chances na prova prática.</p>
      </header>

      <!-- Main Action: Iniciar Simulado -->
      <section class="mt-2">
        <a routerLink="/simulado" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 px-6 rounded-3xl flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10 group transition-all duration-300 relative overflow-hidden">
           <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <mat-icon class="material-icons !text-4xl !leading-none !w-10 !h-10 mb-2 relative z-10 text-slate-900">directions_car</mat-icon>
          <span class="text-xl relative z-10">Iniciar Simulado</span>
          <span class="text-[11px] opacity-70 font-medium uppercase mt-1 relative z-10">Faça um teste completo do circuito</span>
        </a>
      </section>

      <!-- Secondary Secondary Actions Grid -->
      <section class="flex flex-col gap-4 mt-2">

        <!-- Historico -->
        <a routerLink="/historico" class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-5 rounded-3xl flex items-center gap-4 cursor-pointer border border-gray-100 dark:border-white/5 transition-all shadow-sm">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
             <mat-icon class="material-icons !text-2xl !leading-none !w-6 !h-6">history</mat-icon>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Meu Histórico</h3>
            <p class="text-xs text-gray-500 dark:text-slate-400">Evolução e resultados</p>
          </div>
        </a>

        <!-- Ranking -->
        <a routerLink="/ranking" class="bg-white dark:bg-slate-800/40 hover:dark:bg-slate-800 p-5 rounded-3xl flex items-center gap-4 cursor-pointer border border-gray-100 dark:border-white/5 transition-all shadow-sm">
          <div class="w-12 h-12 bg-amber-50 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
             <mat-icon class="material-icons !text-2xl !leading-none !w-6 !h-6">emoji_events</mat-icon>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Ranking Semanal</h3>
            <p class="text-xs text-gray-500 dark:text-slate-400">Dispute o topo com outros alunos</p>
          </div>
        </a>

      </section>

      <!-- Quick Tips Card -->
      <section class="bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-white/5 p-5 rounded-3xl relative overflow-hidden mt-2 shadow-sm dark:shadow-lg">
        <!-- Decoration -->
        <div class="absolute -right-4 -bottom-6 opacity-10 text-brand-600 dark:text-white">
          <mat-icon class="material-icons !text-8xl">lightbulb</mat-icon>
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <mat-icon class="material-icons !text-lg !leading-none !w-5 !h-5">lightbulb</mat-icon>
            <span class="text-[10px] font-bold uppercase tracking-widest text-brand-800/60 dark:text-slate-400">Dica do Dia</span>
          </div>
          <p class="text-sm text-brand-700 dark:text-gray-300 leading-relaxed font-medium">
            {{ currentTip() }}
          </p>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  currentTip = signal<string>('');

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    this.currentTip.set(TIPS[randomIndex]);
  }
}

