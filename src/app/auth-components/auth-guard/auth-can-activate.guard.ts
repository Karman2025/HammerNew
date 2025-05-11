import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authCanActivateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const signInToken = localStorage.getItem('USER-JWT-TOKEN');

  if (signInToken !== null) {
    return true;
  } else {
    router.navigateByUrl('signin');
    return false;
  }
};

