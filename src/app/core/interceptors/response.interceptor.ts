import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

/**
 * Global response interceptor to automatically unwrap the 'data' property 
 * from Laravel API Resource responses.
 * Only applies when the user is logged in to avoid breaking the login flow.
 * Note: We check localStorage directly to avoid circular dependency with AuthService.
 */
export const responseInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      // Check authentication state via token existence in localStorage
      // This avoids injecting AuthService which causes a circular dependency
      const isAuthenticated = !!localStorage.getItem('pos-token');

      // Only unwrap if the user is authenticated
      if (isAuthenticated && event instanceof HttpResponse && event.body && typeof event.body === 'object') {
        const body = event.body as any;
        
        // If the body has a 'data' property, we unwrap it
        if ('data' in body) {
          return event.clone({ body: body.data });
        }
      }
      return event;
    })
  );
};
