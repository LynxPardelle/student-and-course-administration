import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Main */
import { HomeComponent } from './components/main/home/home.component';

/* User */
import { LoginComponent } from './components/user/login/login.component';
import { UserComponent } from './components/user/user/user.component';
import { UsersComponent } from './components/user/users/users.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // Main
  { path: 'home', component: HomeComponent },

  // User
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
