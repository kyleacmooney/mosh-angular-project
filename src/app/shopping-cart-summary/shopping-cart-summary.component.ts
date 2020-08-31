import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { ShoppingCart, ShoppingCartItem } from '../models/shopping-cart';
import { Product } from '../models/product';
import { ProductService } from './../services/product.service';

@Component({
  selector: 'shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.css']
})
export class ShoppingCartSummaryComponent implements OnInit, OnDestroy {

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
    this.cartSubscription = (await this.cartService.getCart())
      .subscribe(cart => this.cart = cart);

    this.productsSubscription = this.productService.getAll()
      .subscribe(products => this.products = products);
  }

  // NOTE: This is duplicate code from shopping cart component, due to the issue of having to do all
  // these separate calls to firebase to get the products and cart, partially due to my desire not to
  // duplicate product information inside of the cart.
  //
  // TODO: Think of/research alternatives---like the share pipe function on rxjs Observables in
  // the services or using redux, so that this.  Either of those ways, it seems this method could be
  // implemented in there if we maintained a policy of only storing product keys in the cart.
  //
  // One thing Mosh does is use input properties and passes things like cart data down to child
  // components that way, but that seems like bad design---not object oriented.
  getProduct(productKey: string): Product {
    return this.products.find(p => p.key === productKey);
  }

  // NOTE: This is also a duplicate method---this makes me think that I could or should use his
  // implementation of shopping cart for the local instances of it but keep it as I wanted on the server.
  // That would solve some problems.
  getPrice(product: Product, item: ShoppingCartItem): number {
    return product.price * item.quantity;
  }

  // NOTE: Another duplicate method from the shopping-cart component.
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

}
