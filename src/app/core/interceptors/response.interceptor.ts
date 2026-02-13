import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

/**
 * Global response interceptor to automatically unwrap the 'data' property 
 * from Laravel API Resource responses.
 */
export const responseInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object') {
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
