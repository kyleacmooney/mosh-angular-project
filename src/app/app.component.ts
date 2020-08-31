import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  userSubscription: Subscription;

  constructor(private userService: UserService, private auth: AuthService, private router: Router) {

    // Redirect user upon login:
    this.userSubscription = this.auth.user$.subscribe(user => {
      // On login, this observable emits the User object, so update/store user in database
      // and navigate according to what AuthService stores in local storage.
      if (!user) return;

      this.userService.save(user);
      const returnUrl = localStorage.getItem('returnUrl');

      // On refresh, do nothing else:
      if (!returnUrl) return;

      // Navigates to home if navigation to the initial returnUrl does not succeed:
      // (i.e., the user was not authorized)
      localStorage.removeItem('returnUrl');
      this.router.navigateByUrl(returnUrl).then(navSucceeded => {
        if (!navSucceeded) {
          this.router.navigate(['/']);
          // TODO: Display toast notification
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
