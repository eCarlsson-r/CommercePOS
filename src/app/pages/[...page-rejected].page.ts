import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  redirectTo: '/login',
  pathMatch: 'full'
};

@Component({
  standalone: true,
  template: ''
})
export default class PageRejectedComponent {}
