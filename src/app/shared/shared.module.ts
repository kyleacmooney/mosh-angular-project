import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HammerModule } from '@angular/platform-browser';
import { CustomFormsModule } from 'ngx-custom-validators';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AdminAuthGuard } from '../admin/services/admin-auth-guard.service';
import { ProductBoxComponent } from './components/product-box/product-box.component';
import { ProductQuantityComponent } from './product-quantity/product-quantity.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { UserService } from './services/user.service';

const angularMaterialModules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatTableModule,
  MatCardModule,
  MatPaginatorModule,
  MatSortModule,
  MatListModule,
  MatSelectModule,
  MatInputModule,
  MatGridListModule,
  MatFormFieldModule,
  MatBadgeModule,
  MatDividerModule
];

const sharedModules = [
  CommonModule,
  HammerModule,
  FormsModule,
  CustomFormsModule,
  AngularFireDatabaseModule,
  AngularFireAuthModule,
  ...angularMaterialModules
];

@NgModule({
  declarations: [
    ProductBoxComponent,
    ProductQuantityComponent
  ],
  imports: [
    ...sharedModules
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminAuthGuard,
    UserService,
    CategoryService,
    ProductService,
    ShoppingCartService,
    OrderService
  ],
  exports: [
    ProductBoxComponent,
    ProductQuantityComponent,
    ...sharedModules
  ]
})
export class SharedModule { }
