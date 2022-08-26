import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { LoginComponent } from 'src/app/user/components/login/login.component';
import { UserComponent } from 'src/app/user/components/user/user.component';
import { UsersComponent } from 'src/app/user/components/users/users.component';

const routes: Routes = [
  {
    path: 'user',
    children: [
      { path: '', component: UserComponent },
      { path: 'id/:id', component: UserComponent },
      { path: 'list', component: UsersComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
