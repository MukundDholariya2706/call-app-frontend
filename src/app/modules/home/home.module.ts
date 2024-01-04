import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { UserListModule } from '../user-list/user-list.module';
import { WelcomeModule } from '../welcome/welcome.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    WelcomeModule,
    UserListModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class HomeModule {}
