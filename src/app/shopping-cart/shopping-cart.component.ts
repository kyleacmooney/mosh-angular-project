import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';
import { ShoppingCart } from '../shared/models/shopping-cart';
import {  Subscription } from 'rxjs';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../shared/models/product';
import { ShoppingCartItem } from '../shared/models/shopping-cart';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  cart: ShoppingCart;
  products: Product[] = [];

  cartSubscription: Subscription;
  productsSubscription: Subscription;

  constructor(
    private cartService: ShoppingCartService,
    private productService: ProductService
  ) { }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.productsSubscription = this.productService.getAll()
      .subscribe((products: Product[]) => this.products = products);

    this.cartSubscription = (await this.cartService.getCart())
      .subscribe((cart: ShoppingCart) => this.cart = cart);
  }

  getProduct(productKey): Product {
    return this.products.find(p => p.key === productKey);
  }

  getPrice(product: Product, item: ShoppingCartItem): number {
    return product.price * item.quantity;
  }

  // TODO: Move this function to shopping-cart service?
  getTotalPrice(): number {
    if (!this.cart || !this.products) return 0;

    let totalPrice = 0;

    Object.entries(this.cart.items).forEach(
      (entry: [string, ShoppingCartItem]) => {
        const product: Product = this.products.find(p => p.key === entry[0]);
        if (product) totalPrice += entry[1].quantity * product.price;
    });
    return totalPrice;
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

}
