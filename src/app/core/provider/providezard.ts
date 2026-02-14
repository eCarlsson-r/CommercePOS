import { importProvidersFrom, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';
import { CheckCircle, AlertCircle, ArrowRight, Check, Edit3, Loader2, File, LogIn, LogOut, Lock, LucideAngularModule, Mail, MapPin, Plus, ShoppingCart, Trash2, Truck, UserPlus, Users, LayoutDashboard, Package, FileText, TrendingUp, Zap, MonitorSmartphone, PackageSearch, Banknote, PlusCircle, MinusCircle, AlertTriangle, Folder, RotateCcw, ClipboardList, Search, Download, Power, Coffee, Printer, Store, ImagePlus, MoreVertical, Phone, Tag, X, UserX, History, Menu, Settings, Settings2, Eye, RefreshCw, ShoppingBag, Globe, ReceiptText, ClipboardPenLine, Minus, Inbox, User  } from 'lucide-angular';

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
        X,
        User,
        UserX,
        RefreshCw,
        RotateCcw,
        ClipboardPenLine,
        ClipboardList,
        Plus,
        Minus,
        Inbox,
        Globe,
        History,
        LayoutDashboard,
        Package,
        PackageSearch,
        ShoppingCart, 
        Truck, 
        ShoppingBag,
        Users, 
        AlertCircle, 
        AlertTriangle,
        PlusCircle,
        MinusCircle,
        CheckCircle,
        Banknote,
        Edit3, 
        Trash2, 
        Loader2,
        Settings,
        Settings2,
        MapPin, 
        File,
        ReceiptText,
        FileText,
        TrendingUp,
        MonitorSmartphone,
        Zap,
        Eye,
        Printer,
        Store,
        ImagePlus,
        UserPlus, 
        ArrowRight, 
        Tag,
        Search,
        Download,
        Phone,
        Check,
        Mail,
        MoreVertical,
        Coffee,
        Power,
        Lock,
        LogIn,
        LogOut,
        Menu
      })
    )
  ]);
}
