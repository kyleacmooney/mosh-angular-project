import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.auth.appUser$.pipe(map(appUser => {
      if (!appUser.isAdmin) {
        this.router.navigate(['/']);
        // TODO: Display toast notification
        return false;
      }
      return appUser.isAdmin;
    }));
  }

}
