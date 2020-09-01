import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../models/product';
import { map, take } from 'rxjs/operators';
import { ShoppingCartItem, ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  // NOTE: Back-end issue---carts don't ever disappear.  Potentially useful references:
  // https://firebase.googleblog.com/2017/03/how-to-schedule-cron-jobs-with-cloud.html
  // https://stackoverflow.com/questions/32004582/delete-firebase-data-older-than-2-hours
  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    // TODO: Handle the error when the cartId from local storage is no longer in the database
    return this.db.object('/shopping-carts/' + cartId).snapshotChanges().pipe(
      map(c => new ShoppingCart(c.payload.val() as any)));
  }

  async addToCart(product: Product): Promise<void> {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product): Promise<void> {
    this.updateItemQuantity(product, -1);
  }

  async clearCart(): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  /** Private methods: */

  private async updateItemQuantity(product: Product, change: number): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const fireProduct = this.getFireProduct(cartId, product.key);
    fireProduct.snapshotChanges().pipe(take(1)).subscribe(item => {
      if (!item.payload.exists()) {
        fireProduct.update ( { quantity: 1 } );
      }
      else {
        const newQuantity = (item.payload.val() as ShoppingCartItem).quantity + change;
        fireProduct.update( { quantity: newQuantity } );
        if (newQuantity === 0)
          fireProduct.remove();
      }
    });
  }

  private getFireProduct(cartId: string, productKey: string): any {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productKey);
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  // TODO: Does logging out and then logging in to a different account not change the cart?
  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

}
