import { HttpInterceptorFn } from '@angular/common/http';
import { Stored_Keys } from '../constants/stored_keys';

export const handleHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const token : string | null = localStorage.getItem(Stored_Keys.USER_TOKEN);
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
