import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'simulado', loadComponent: () => import('./pages/simulation/simulation').then(m => m.SimulationComponent) },
  { path: 'historico', loadComponent: () => import('./pages/history/history').then(m => m.HistoryComponent) },
  { path: 'ranking', loadComponent: () => import('./pages/ranking/ranking').then(m => m.RankingComponent) },
  { path: '**', redirectTo: '' }
];
