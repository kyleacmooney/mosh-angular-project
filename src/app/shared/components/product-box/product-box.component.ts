import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { isWebUri } from 'valid-url';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../models/shopping-cart';

@Component({
  selector: 'product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css']
})
export class ProductBoxComponent {

  @Input('product') product: Product;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) { }

  hasValidImgUrl(): boolean {
    return isWebUri(this.product.imageUrl);
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
    console.log('in product box');
  }

}
