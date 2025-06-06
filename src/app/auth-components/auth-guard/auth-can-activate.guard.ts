import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const authCanActivateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Get token
  const signInToken = localStorage.getItem('USER-JWT-TOKEN');
  if (!signInToken) {
    router.navigateByUrl('signin');
    return false;
  }

  // Get user info
  const userInfoStr = localStorage.getItem('USER-INFO');
  if (!userInfoStr) {
    router.navigateByUrl('signin');
    return false;
  }

  const userInfo = JSON.parse(userInfoStr);
  const role = userInfo.role;

  const currentUrl = state.url;

  if (role === "1") {
    return true;
  } else if (role === "2") {
    if (currentUrl === '/home/branches') {
      return router.parseUrl('/unauthorised');
    }
    return true;
  } else if(role === "3") {
    let notAllowedRoutes:any[] = ['/home/branches', '/home/customers', '/home/customer-details', '/home/trainers', '/home/payments', '/home/attendance', '/home/accounts', '/home/welcome'];
    if(notAllowedRoutes.includes(currentUrl)){
      return router.parseUrl('/unauthorised');
    }
    return true;
  } else {
    return router.parseUrl('/unauthorised');
  }
};
