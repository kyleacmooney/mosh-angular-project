import { Component, Input } from '@angular/core';
import { Product } from '../shared/models/product';
import { isWebUri } from 'valid-url';
import { ShoppingCartService } from '../shared/services/shopping-cart.service';
import { ShoppingCart } from '../shared/models/shopping-cart';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input('product') product: Product;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) { }

  hasValidImgUrl(): boolean {
    return isWebUri(this.product.imageUrl);
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }

}
