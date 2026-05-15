import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Simulado {
  private http = inject(HttpClient);

  postLead(data: Record<string, unknown>) {
    this.http.post('https://api.dirigiragora.com.br/v1/simulado/newLead', data).subscribe({
      next: () => { /* silently success */ },
      error: (err) => console.error('Erro silencioso ao enviar lead:', err)
    });
  }
}
