import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './media-uploader.component.html'
})
export class MediaUploaderComponent {
  @Output() onUpload = new EventEmitter<File[]>();
  
  // Variables required by your HTML
  previews: string[] = [];
  uploadProgress: number = 0; // Starts at 0 to hide the bar

  /**
   * Matches the (change)="onFileSelected($event)" in your HTML
   */
  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length === 0) return;

    // 1. Generate Previews
    this.previews = files.map(file => URL.createObjectURL(file));

    // 2. Simulate Upload Progress
    // In a real app, this would come from an HttpClient event
    this.simulateProgress();

    // 3. Emit the files to the parent (like ProductFormComponent)
    this.onUpload.emit(files);
  }

  private simulateProgress() {
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        // Reset after a delay or leave at 100 to show completion
      }
    }, 100);
  }
}