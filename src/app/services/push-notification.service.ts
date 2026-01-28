// src/app/services/push-notification.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  /**
   * Checks if the browser supports notifications and asks for permission
   */
  async checkSubscriptionStatus() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }
  }

  /**
   * Triggers a browser-level popup
   */
  showNotification(title: string, body: string) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/assets/icons/favicon.ico' // Ensure this path exists
      });
    }
  }
}