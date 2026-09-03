import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

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

        <!-- Aulas Práticas -->
        <button type="button" (click)="openAulasPraticas()"
          class="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-3xl flex items-center gap-4 shadow-md group transition-all duration-300 active:scale-[0.98] active:translate-y-1 cursor-pointer border-b-[4px] border border-gray-100 dark:border-white/5 border-b-gray-200 dark:border-b-white/10 hover:border-b-[2px] hover:translate-y-[1px] text-left">
          <div class="w-14 h-14 flex-shrink-0 bg-emerald-50 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
             <mat-icon class="material-icons !text-3xl !leading-none !w-8 !h-8">directions_car</mat-icon>
          </div>
          <div class="flex flex-col flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Aulas Práticas</h3>
            <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">Sua autoescola digital</p>
          </div>
          <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <mat-icon class="material-icons !text-xl !leading-none !w-5 !h-5">chevron_right</mat-icon>
          </div>
        </button>

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
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Ranking</h3>
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
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Multiplayer</h3>
            <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">Desafie outro jogador</p>
          </div>
          <div class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <mat-icon class="material-icons !text-xl !leading-none !w-5 !h-5">chevron_right</mat-icon>
          </div>
        </a>

        <!-- Card de avaliação -->
        @if (showReviewCard()) {
          <div class="relative flex flex-col gap-3 w-full rounded-2xl border border-blue-100 bg-[#eef1fb] p-4 shadow-sm">
            <!-- Botão fechar -->
            <button
              type="button"
              aria-label="Fechar"
              (click)="dismissReviewCard()"
              class="absolute right-3 top-3 text-slate-400 transition-colors hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="flex items-start gap-3">
              <!-- Ícone estrela -->
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <!-- Texto -->
              <div class="min-w-0 flex-1 pr-5">
                <h2 class="text-sm font-bold leading-tight text-slate-900 text-balance">
                  Ajude-nos a continuar gratuitos!
                </h2>
                <p class="mt-1 text-xs leading-snug text-slate-500 text-pretty">
                  Sua avaliação nos motiva a melhorar e manter o app 100% gratuito para todos.
                </p>
              </div>
            </div>

            <!-- Botão -->
            <a
              href="https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil"
              target="_blank"
              class="mt-1 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Avaliar agora
            </a>
          </div>
        }

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

      <!-- Discrete Instagram Links -->
      <footer class="flex items-center justify-center gap-3 pt-2 pb-2 text-xs text-gray-400 dark:text-slate-500 font-medium">
        <a
          href="https://www.instagram.com/dirigiragora/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>@dirigiragora</span>
        </a>
        <span class="text-gray-300 dark:text-slate-700">•</span>
        <a
          href="https://www.instagram.com/dirigiragora/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-rose-500 dark:hover:text-rose-400 transition-colors underline decoration-dotted underline-offset-2"
        >
          Siga no Instagram
        </a>
      </footer>

    </div>
  `
})
export class HomeComponent implements OnInit {
  currentTip = signal<string>('');
  showReviewCard = signal<boolean>(true);

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    this.currentTip.set(TIPS[randomIndex]);

    if (typeof window !== 'undefined' && window.localStorage) {
      const isDismissed = localStorage.getItem('review_card_dismissed') === 'true';
      if (isDismissed) {
        this.showReviewCard.set(false);
      }
    }
  }

  async openAulasPraticas() {
    const platform = Capacitor.getPlatform();
    let url = 'https://www.dirigiragora.com.br';

    if (platform === 'ios') {
      url = 'https://apps.apple.com/br/app/dirigir-agora-cnh-do-brasil/id6801734923';
    } else if (platform === 'android') {
      url = 'https://play.google.com/store/apps/details?id=br.com.dirigiragora&hl=pt_BR';
    }

    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.open({ url });
      } catch (err) {
        console.log(err);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  }

  dismissReviewCard() {
    this.showReviewCard.set(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('review_card_dismissed', 'true');
      } catch (e) {
        console.error('Erro ao salvar estado do card no localStorage:', e);
      }
    }
  }
}

