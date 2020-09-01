import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ShoppingCartService } from './shopping-cart.service';
import { Order, ServerOrder } from '../models/order';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private cartService: ShoppingCartService,
    private db: AngularFireDatabase
  ) { }

  getOrders(): Observable<Order[]> {
    return this.db.list('/orders').snapshotChanges().pipe(map(this.sortOrdersByDate()));
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.db.list('/orders', ref => ref.orderByChild('userId').equalTo(userId))
      .snapshotChanges().pipe(map(this.sortOrdersByDate()));
  }

  /** In this implementation, it is possible that the second line (for clearing the cart) fails
   *  for some unexpected reason while connecting with Firebase. A more reliable approach is to
   *  have a transaction. This will ensure that during placing an order, an order object is stored
   *  AND the corresponding shopping cart is cleared. Either both these operations succeed together
   *  or they both will fail.
   *
   *  Video on transactions:
   *    https://www.youtube.com/watch?v=dOVSr0OsAoU
   */
  async placeOrder(order: Order) {
    delete order.orderId;
    const result = await this.db.list('/orders').push(order);
    this.cartService.clearCart();
    return result;
  }

  private sortOrdersByDate(): (changes: any) => Order[] {
    return (changes => {
      const orders: Order[] = changes.map(c =>
        Order.fromServer(c.payload.key, c.payload.val() as ServerOrder));
      orders.sort((a, b) => b.datePlaced - a.datePlaced);
      return orders;
    });
  }

}
