import { CanActivateFn, Router } from '@angular/router';
import { Stored_Keys } from '../constants/stored_keys';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem(Stored_Keys.USER_TOKEN);
  let router = inject(Router);

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
