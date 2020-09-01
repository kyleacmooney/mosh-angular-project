import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from '../models/app-user';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router) {
    this.user$ = afAuth.authState;
  }

  login(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);

    // TODO: Redirect the user only if they are on a page for non-anonymous users:

    // This implementation will not work with a lazy-loaded module implementation, or if
    // any guarded routes do not have a canActivate field, or if there are any additional
    // route parameters
    // Source: https://stackoverflow.com/questions/42115612/how-to-get-current-route-guard

    // const currentRouteConfig = this.router.config.find(f => f.path === this.router.url.substr(1));
    // console.log(currentRouteConfig);
    // if (currentRouteConfig != null && currentRouteConfig.canActivate != null)  {
    //   this.router.navigate(['/']);
    // }
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) return this.userService.get(user.uid);
        return of(null);
      }));
  }

}
