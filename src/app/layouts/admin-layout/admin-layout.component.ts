// src/app/layouts/admin-layout/admin-layout.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { RealtimeService } from '@/services/realtime.service'; // Adjust paths as needed
import { PushNotificationService } from '@/services/push-notification.service';
import { BranchService } from '@/services/branch.service';

@Component({
  selector: 'app-admin-layout', // Changed from app-root
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule, 
    LucideAngularModule
  ],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit {
  // Using the modern inject() pattern
  private realtime = inject(RealtimeService);
  private push = inject(PushNotificationService);
  private branchService = inject(BranchService);
  branches = [{id: 1, name: 'Medan Main'}, {id: 2, name: 'Binjai Store'}];

  onBranchChange(event: any) {
    this.branchService.setBranch(Number(event.target.value));
  }

  pendingTransfers = 0;
  hasNewNotifications = false;

  ngOnInit() {
    // 1. Listen for new stock movement requests via Reverb
    this.realtime.listenForTransfers().subscribe({
      next: (data) => {
        this.pendingTransfers++;
        this.hasNewNotifications = true;
        this.playNotificationSound();
      }
    });

    // 2. Initial check for permissions
    this.push.checkSubscriptionStatus();
  }

  playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(err => console.log('Audio play blocked by browser'));
  }
}