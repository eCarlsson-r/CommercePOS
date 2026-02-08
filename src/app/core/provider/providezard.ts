import { importProvidersFrom, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';
import { CheckCircle, AlertCircle, ArrowRight, Check, Edit3, Loader2, LogIn, LogOut, Lock, LucideAngularModule, Mail, MapPin, Plus, ShoppingCart, Trash2, Truck, UserPlus, Users, LayoutDashboard, Package, FileText, TrendingUp, Zap, MonitorSmartphone, PackageSearch, Banknote, PlusCircle, AlertTriangle, Folder, RotateCcw, ClipboardList, Search, Download, Power, Coffee } from 'lucide-angular';

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

  return makeEnvironmentProviders([
    ...eventManagerPlugins, 
    importProvidersFrom(
      LucideAngularModule.pick({
        Folder,
        RotateCcw,
        ClipboardList,
        Plus,
        LayoutDashboard,
        Package,
        PackageSearch,
        ShoppingCart, 
        Truck, 
        Users, 
        AlertCircle, 
        AlertTriangle,
        PlusCircle,
        CheckCircle,
        Banknote,
        Edit3, 
        Trash2, 
        Loader2,
        MapPin, 
        FileText,
        TrendingUp,
        MonitorSmartphone,
        Zap,
        UserPlus, 
        ArrowRight, 
        Search,
        Download,
        Check,
        Mail,
        Coffee,
        Power,
        Lock,
        LogIn,
        LogOut
      })
    )
  ]);
}
