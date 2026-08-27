
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  public pushPermission = signal<'prompt' | 'prompt-with-rationale' | 'granted' | 'denied' | null>(null);
  public fone1 = signal<string | null>(null);
  public pushDeclinedIos = signal<boolean>(localStorage.getItem('pushDeclinedIos') === 'true');

}
