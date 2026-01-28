// src/app/core/guards/app-init.guard.ts
import { inject } from '@angular/core';
import { MasterDataStore } from '../store/master-data.store';

export const appInitGuard = () => {
  const store = inject(MasterDataStore);
  
  // If data isn't loaded yet, trigger the init
  if (!store.isLoaded()) {
    store.init();
  }
  return true; // We allow navigation while it loads in the background
};