import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { ShoppingCart } from '../../../shared/models/shopping-cart';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Order } from '../../../shared/models/order';
import { Router } from '@angular/router';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {

  shipping = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: ''
  };
  cart: ShoppingCart;
  cartSubscription: Subscription;
  userSubscription: Subscription;
  userId: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: ShoppingCartService,
    private orderService: OrderService,
  ) { }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.cartSubscription = (await this.cartService.getCart())
      .subscribe((cart: ShoppingCart) => this.cart = cart);
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }

  async placeOrder(): Promise<void> {
    const result = await this.orderService.placeOrder(new Order(this.userId, this.shipping, this.cart));
    this.router.navigate(['order-success', result.key]);
  }

}
