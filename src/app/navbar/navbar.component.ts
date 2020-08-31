import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { AppUser } from './../models/app-user';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  collapsed = true;
  appUser: AppUser;
  cart$: Observable<ShoppingCart>;

  constructor(
    private cartService: ShoppingCartService,
    private auth: AuthService
    ) {
  }

  async ngOnInit(): Promise<void> {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
    this.cart$ = await this.cartService.getCart();
  }

  logout(): void {
    this.auth.logout();
  }

}
