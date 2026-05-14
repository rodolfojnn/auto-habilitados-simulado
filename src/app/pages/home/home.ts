import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const TIPS = [
  "Ajuste o banco, os retrovisores e coloque o cinto de segurança antes de ligar o veículo.",
  "Verifique se as portas estão bem fechadas antes de iniciar o percurso.",
  "Sempre sinalize com a seta antes de sair com o carro ou realizar qualquer manobra.",
  "Engate a primeira marcha e abaixe o freio de mão completamente antes de arrancar.",
  "Cuidado para o carro não voltar ao arrancar em aclives (subidas).",
  "Não desengrene o veículo (deixar em ponto morto) com ele em movimento.",
  "Atenção constante aos espelhos retrovisores durante todo o percurso.",
  "Respeite rigorosamente os limites de velocidade da via.",
  "Para a baliza, use os pontos de referência que você aprendeu nas aulas.",
  "Na baliza, é permitido ajustar o volante com o veículo parado, mas faça os movimentos com suavidade.",
  "Atenção ao tempo limite para a realização da baliza (se houver no seu estado).",
  "Sinalize com antecedência ao se aproximar do local da baliza.",
  "Ao finalizar a baliza, siga o procedimento orientado pelo examinador, normalmente acionando o freio de mão e deixando o veículo em segurança.",
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
  "Mantenha a calma e a concentração durante o exame. Controle o nervosismo para evitar erros por distração.",
  "Não deixe o motor morrer. Se acontecer, mantenha a calma, coloque em ponto morto e ligue novamente.",
  "Não transite na contramão de direção, mesmo que por um pequeno trecho.",
  "Obedeça às orientações do examinador sem desrespeitar as leis e sinalizações de trânsito.",
  "Atenção redobrada em cruzamentos com linha férrea (pare, olhe e escute).",
  "Use o freio de modo suave e progressivo.",
  "Na saída da baliza, observe o trânsito nos retrovisores e dê a seta.",
  "Evite cruzar excessivamente os braços ao virar o volante, mantendo sempre o controle da direção.",
  "Na ausência de orientação do examinador, siga a sinalização da via e prossiga com segurança.",
  "Não tente adivinhar o percurso, ouça atentamente o examinador.",
  "Em caso de chuva, ligue os limpadores de para-brisa.",
  "Evite usar farol alto no perímetro urbano, especialmente quando houver outros veículos à frente ou no sentido contrário.",
  "Cuidado para não usar a buzina sem necessidade.",
  "Mantenha o controle da direção em linha reta, sem 'costurar' na via.",
  "Em ladeiras, procure arrancar com controle para evitar que o veículo recue excessivamente.",
  "Não avance o sinal vermelho do semáforo sob nenhuma circunstância.",
  "Respeite a faixa contínua, evitando ultrapassagens e mudanças de faixa proibidas pela sinalização.",
  "A marcha a ré deve ser utilizada apenas em manobras e deslocamentos curtos.",
  "Use calçados adequados e que fiquem firmes nos pés (sandálias abertas são proibidas).",
  "Não desengate o veículo em declives (não ande na 'banguela').",
  "Dirija com atenção, tranquilidade e controle do veículo durante todo o exame.",
  "Evite deixar o motor apagar durante as manobras e deslocamentos.",
  "Lembre-se: errar uma manobra não significa reprovação automática, se não for eliminatória. Continue concentrado!",
  "Antes de abrir a porta para sair do veículo, verifique o trânsito e ciclistas pelos retrovisores.",
  "Respeite a preferência de veículos já circulando em rotatórias.",
  "Reduza a velocidade ao se aproximar de escolas, faixas de pedestres e áreas movimentadas.",
  "Evite conversar desnecessariamente durante a prova para manter a concentração.",
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-6 py-6 max-w-lg mx-auto w-full flex flex-col gap-6 font-sans">

      <!-- User Greeting / Hero -->
      <!-- <header class="flex flex-col gap-1">
        <p class="text-[10px] uppercase tracking-widest text-brand-600 dark:text-slate-400 font-bold">Bem-vindo(a) de volta!</p>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pronto para a sua CNH?</h1>
        <p class="text-gray-600 dark:text-slate-400 text-sm">Pratique e melhore suas chances na prova prática.</p>
      </header> -->
      <header>
        <img
          style="max-height: 70px"
          src="assets/logo-simulado.png"
          alt="Simulado CNH do Brasil"
          class="w-full h-full object-contain drop-shadow-md"
        />
      </header>

      <!-- Secondary Actions Grid -->
      <section class="flex flex-col gap-4">

        <!-- Main Action: Iniciar Simulado -->
        <a routerLink="/simulado"
          class="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-3xl flex items-center gap-4 shadow-md group transition-all duration-300 active:scale-[0.98] active:translate-y-1 cursor-pointer border-b-[4px] border border-gray-100 dark:border-white/5 border-b-gray-200 dark:border-b-white/10 hover:border-b-[2px] hover:translate-y-[1px]">
          <div class="w-14 h-14 flex-shrink-0 bg-rose-50 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/30">
             <mat-icon class="material-icons !text-3xl !leading-none !w-8 !h-8">play_circle</mat-icon>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Iniciar Simulado</h3>
            <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">30 Questões Oficiais</p>
          </div>
          <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <mat-icon class="material-icons !text-xl !leading-none !w-5 !h-5">chevron_right</mat-icon>
          </div>
        </a>

        <!-- Historico -->
        <a routerLink="/historico"
          class="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-3xl flex items-center gap-4 shadow-md group transition-all duration-300 active:scale-[0.98] active:translate-y-1 cursor-pointer border-b-[4px] border border-gray-100 dark:border-white/5 border-b-gray-200 dark:border-b-white/10 hover:border-b-[2px] hover:translate-y-[1px]">
          <div class="w-14 h-14 flex-shrink-0 bg-blue-50 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
             <mat-icon class="material-icons !text-3xl !leading-none !w-8 !h-8">history</mat-icon>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Meu Histórico</h3>
            <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">Evolução e resultados</p>
          </div>
          <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <mat-icon class="material-icons !text-xl !leading-none !w-5 !h-5">chevron_right</mat-icon>
          </div>
        </a>

        <!-- Ranking -->
        <a routerLink="/ranking"
          class="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-3xl flex items-center gap-4 shadow-md group transition-all duration-300 active:scale-[0.98] active:translate-y-1 cursor-pointer border-b-[4px] border border-gray-100 dark:border-white/5 border-b-gray-200 dark:border-b-white/10 hover:border-b-[2px] hover:translate-y-[1px]">
          <div class="w-14 h-14 flex-shrink-0 bg-amber-50 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30">
             <mat-icon class="material-icons !text-3xl !leading-none !w-8 !h-8">emoji_events</mat-icon>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Ranking Semanal</h3>
            <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">Dispute o topo online</p>
          </div>
          <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <mat-icon class="material-icons !text-xl !leading-none !w-5 !h-5">chevron_right</mat-icon>
          </div>
        </a>

        <!-- Duelo -->
        <a routerLink="/duelo"
          class="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-3xl flex items-center gap-4 shadow-md group transition-all duration-300 active:scale-[0.98] active:translate-y-1 cursor-pointer border-b-[4px] border border-gray-100 dark:border-white/5 border-b-gray-200 dark:border-b-white/10 hover:border-b-[2px] hover:translate-y-[1px]">
          <div class="w-14 h-14 flex-shrink-0 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30">
             <mat-icon class="material-icons !text-3xl !leading-none !w-8 !h-8">sports_esports</mat-icon>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Duelo Multiplayer</h3>
            <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">Desafie outro jogador</p>
          </div>
          <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <mat-icon class="material-icons !text-xl !leading-none !w-5 !h-5">chevron_right</mat-icon>
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

