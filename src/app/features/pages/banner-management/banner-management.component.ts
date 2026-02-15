import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { BannerService } from '@/services/banner.service';

@Component({
  selector: 'app-banner-management',
  templateUrl: './banner-management.component.html',
  imports: [LucideAngularModule, FormsModule]
})
export class BannerManagementComponent {
  private bannerService = inject(BannerService);
  
  banners = signal<any[]>([]);
  isUploading = signal(false);
  
  // Form State
  newBanner = {
    title: '',
    link_url: '',
    image: null as File | null
  };

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.bannerService.getBanners().subscribe(data => this.banners.set(data));
  }

  onFileSelected(event: any) {
    this.newBanner.image = event.target.files[0];
  }

  saveBanner() {
    if (!this.newBanner.image) return alert('Please select an image');
    
    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('image', this.newBanner.image);
    formData.append('title', this.newBanner.title);
    formData.append('link_url', this.newBanner.link_url);

    this.bannerService.createBanner(formData).subscribe({
      next: () => {
        this.loadBanners();
        this.resetForm();
        this.isUploading.set(false);
      },
      error: () => this.isUploading.set(false)
    });
  }

  toggleStatus(banner: any) {
    this.bannerService.toggleBannerStatus(banner.id).subscribe(() => {
      this.loadBanners();
    });
  }

  deleteBanner(id: number) {
    if (confirm('Remove this banner from the website?')) {
      this.bannerService.deleteBanner(id).subscribe(() => this.loadBanners());
    }
  }

  private resetForm() {
    this.newBanner = { title: '', link_url: '', image: null };
  }
}