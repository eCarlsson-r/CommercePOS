import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';
import { 
  LUCIDE_ICONS, 
  LucideIconProvider, // This is the class behind the provider
  Package, 
  AlertTriangle, 
  Banknote, 
  ShoppingCart, 
  LayoutDashboard,
  Eye, 
  MapPin,
  PackageSearch,
  CheckCircle,
  Layout
} from 'lucide-angular';

export function provideZard(): EnvironmentProviders {
  const eventManagerPlugins = [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardEventManagerPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardDebounceEventManagerPlugin,
      multi: true,
    },
  ];

  // 1. Group your icons into an object
  const icons = { 
    Package, 
    AlertTriangle, 
    Banknote, 
    ShoppingCart, 
    MapPin, 
    LayoutDashboard, 
    PackageSearch, 
    CheckCircle,
    Eye,
    Layout
  };

  return makeEnvironmentProviders([
    ...eventManagerPlugins, 
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: icons
    }
  ]);
}
