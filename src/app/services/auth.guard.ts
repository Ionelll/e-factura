import { inject } from '@angular/core';
import { AuthService } from './authentication.service';
import { Router } from '@angular/router';
export const AuthGuard = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isLoggedIn = authService.checkIsLoggedIn();
  console.log(isLoggedIn);
  if (isLoggedIn) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
