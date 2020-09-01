import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // TODO: Implement some checking to ensure there is an id parameter, that it is valid, and that
  // it corresponds to this user's id (that it is was an order made by this user).

}
