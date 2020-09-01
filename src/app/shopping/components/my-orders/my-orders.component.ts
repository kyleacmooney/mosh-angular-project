import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../../shared/models/order';
import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../shared/services/auth.service';
import { switchMap } from 'rxjs/operators';

// TODO: Merge this and admin-orders

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders$: Observable<Order[]>;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.orders$ = this.authService.user$.pipe(
      switchMap(user => this.orderService.getOrdersByUser(user.uid)));
  }
}
