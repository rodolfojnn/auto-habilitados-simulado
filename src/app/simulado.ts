import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Simulado {
  private http = inject(HttpClient);

  postLead(data: Record<string, unknown>): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.post('https://api.dirigiragora.com.br/v1/simulado/newLead', data).subscribe({
        next: () => {
          console.log('Lead enviado com sucesso para o backend');
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('lead_sync_pending');
            localStorage.removeItem('pending_lead_payload');
          }
          resolve(true);
        },
        error: (err) => {
          console.error('Falha ao enviar lead ao backend (salvo para retentativa):', err);
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem('lead_sync_pending', 'true');
              localStorage.setItem('pending_lead_payload', JSON.stringify(data));
            } catch (storageErr) {
              console.error('Erro ao salvar lead offline:', storageErr);
            }
          }
          resolve(false);
        }
      });
    });
  }

  async syncPendingLead(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const isPending = localStorage.getItem('lead_sync_pending') === 'true';
    const payloadStr = localStorage.getItem('pending_lead_payload');

    if (isPending && payloadStr) {
      try {
        const payload = JSON.parse(payloadStr) as Record<string, unknown>;
        console.log('Tentando sincronizar lead pendente...');
        await this.postLead(payload);
      } catch (e) {
        console.error('Erro ao analisar payload pendente:', e);
      }
    }
  }
}
