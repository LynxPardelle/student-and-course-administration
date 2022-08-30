import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { UserRoutingModule } from 'src/app/user/user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

/* Components */
import { UserComponent } from 'src/app/user/components/user/user.component';
import { UsersComponent } from 'src/app/user/components/users/users.component';

@NgModule({
  declarations: [UserComponent, UsersComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
