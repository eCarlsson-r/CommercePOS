// src/app/app.ts (AppComponent)
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PushNotificationService } from '@/services/push-notification.service';
import { SwPush } from '@angular/service-worker';

interface PushPayload {
  notification?: {
    title: string;
    body: string;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})

export class App implements OnInit {
  private push = inject(PushNotificationService);
  private swPush = inject(SwPush);

  ngOnInit() {
    // Check for notification permissions as soon as the app loads
    this.push.checkSubscriptionStatus();

    // Listen for messages while the app is open
    this.swPush.messages.subscribe((message: PushPayload) => {
      if (message.notification) {
        // We pass the title and the body separately to match the service
        this.push.showNotification(
          message.notification.title || 'New Update',
          message.notification.body || ''
        );
      }
    });
  }
}