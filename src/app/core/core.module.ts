import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    NotFoundComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ])
  ],
  exports: [
    NavbarComponent
  ]
})
export class CoreModule { }
