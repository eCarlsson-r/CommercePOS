import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AIService } from '@/services/ai.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-floating-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TranslateModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <!-- Chat Window -->
      @if (isOpen()) {
        <div class="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
          <!-- Header -->
          <div class="bg-primary p-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <lucide-icon name="bot" class="w-5 h-5 text-white"></lucide-icon>
              <span class="text-white font-semibold text-sm">{{ 'assistant.title' | translate }}</span>
            </div>
            <button (click)="toggleOpen()" class="text-white/80 hover:text-white">
              <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <!-- Messages -->
          <div class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            @if (messages().length === 0) {
              <div class="text-center text-gray-400 py-8">
                <lucide-icon name="sparkles" class="w-8 h-8 mx-auto mb-2 opacity-50"></lucide-icon>
                <p class="text-xs">{{ 'assistant.welcome' | translate }}</p>
              </div>
            }
            
            @for (message of messages(); track $index) {
              <div [class]="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                <div [class]="message.role === 'user' 
                  ? 'bg-primary text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[85%]' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-4 py-2 max-w-[85%] shadow-sm'">
                  <p class="text-sm">{{ message.content }}</p>
                  <span class="text-[10px] opacity-60 mt-1 block">
                    {{ message.timestamp | date:'shortTime' }}
                  </span>
                </div>
              </div>
            }

            @if (isLoading()) {
              <div class="flex justify-start">
                <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div class="flex gap-1">
                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Quick Actions -->
          @if (followUps().length > 0 && !isLoading()) {
            <div class="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div class="flex flex-wrap gap-2">
                @for (followUp of followUps(); track $index) {
                  <button 
                    (click)="sendMessage(followUp)"
                    class="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                    {{ followUp }}
                  </button>
                }
              </div>
            </div>
          }

          <!-- Input -->
          <div class="p-3 bg-white border-t border-gray-200">
            <div class="flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="inputMessage"
                (keyup.enter)="sendMessage(inputMessage)"
                [placeholder]="'assistant.placeholder' | translate"
                class="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <button 
                (click)="sendMessage(inputMessage)"
                [disabled]="!inputMessage.trim() || isLoading()"
                class="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <lucide-icon name="send" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Floating Button -->
      <button 
        (click)="toggleOpen()"
        [class]="isOpen() 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30'"
        class="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95">
        @if (isOpen()) {
          <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
        } @else {
          <lucide-icon name="bot" class="w-6 h-6"></lucide-icon>
        }
      </button>
    </div>
  `
})
export class FloatingAssistantComponent {
  private aiService = inject(AIService);
  private translate = inject(TranslateService);

  isOpen = signal(false);
  isLoading = signal(false);
  inputMessage = '';
  messages = signal<ChatMessage[]>([]);
  followUps = signal<string[]>([]);

  toggleOpen() {
    this.isOpen.update(v => !v);
  }

  sendMessage(content: string) {
    if (!content.trim() || this.isLoading()) return;

    // Add user message
    this.messages.update(msgs => [...msgs, {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }]);

    this.inputMessage = '';
    this.isLoading.set(true);

    // Call AI assistant
    this.aiService.chatAssistant(content.trim()).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: res.reply,
          timestamp: new Date()
        }]);
        this.followUps.set(res.followUps || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: this.translate.instant('assistant.error'),
          timestamp: new Date()
        }]);
        this.isLoading.set(false);
      }
    });
  }
}
