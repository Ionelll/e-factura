import { inject } from '@angular/core';
import { Router } from '@angular/router';
export const AuthGuard = async () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token && token?.length > 0) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
