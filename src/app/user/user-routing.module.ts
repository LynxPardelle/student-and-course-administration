import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { UserComponent } from 'src/app/user/components/user/user.component';
import { UsersComponent } from 'src/app/user/components/users/users.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: UserComponent },
      { path: 'id/:id', component: UserComponent },
      { path: 'list', component: UsersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
