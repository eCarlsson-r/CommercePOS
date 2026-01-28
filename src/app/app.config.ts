import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideZard } from './core/provider/providezard';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { LucideAngularModule } from 'lucide-angular';
import { ShoppingCart, Truck, Users, AlertCircle, Edit3, Trash2, MapPin, UserPlus, ArrowRight, Check } from 'lucide-angular';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZard(), // Your custom initialization logic
    provideHttpClient(withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }), 
    importProvidersFrom(
      LucideAngularModule.pick({
        ShoppingCart, 
        Truck, 
        Users, 
        AlertCircle, 
        Edit3, 
        Trash2, 
        MapPin, 
        UserPlus, 
        ArrowRight, 
        Check 
      })
    )
  ]
};