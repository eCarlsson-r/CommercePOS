import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private echo: Echo<"reverb"> | null = null;
  private transferSubject: Subject<any> = new Subject<any>();

  constructor() {
    // Initialize Echo only if we are in a browser environment
    this.initializeEcho();
  }

  private initializeEcho() {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverbKey,
      wsHost: environment.reverbHost,
      wsPort: environment.reverbPort,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
    });

    // Example: Listen to a public channel for stock updates
    this.echo.channel('inventory-updates')
      .listen('.StockMovement', (data: any) => {
        this.transferSubject.next(data);
      });
  }

  /**
   * Returns an Observable for the Layout to subscribe to
   */
  listenForTransfers() {
    return this.transferSubject.asObservable();
  }
}