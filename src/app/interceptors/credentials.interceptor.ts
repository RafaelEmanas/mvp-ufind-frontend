import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.startsWith(environment.r2PublicEndpoint)) {
    return next(req);
  }

  const clonedReq = req.clone({
    withCredentials: true
  });
  return next(clonedReq);
};