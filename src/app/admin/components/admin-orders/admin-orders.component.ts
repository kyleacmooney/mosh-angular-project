import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order';
import { Observable } from 'rxjs';

// TODO: Merge this and my-orders

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders$: Observable<Order[]>;

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orders$ = this.orderService.getOrders();
  }

}
