import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { UserRoutingModule } from 'src/app/user/user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

/* Components */
import { LoginComponent } from 'src/app/user/components/login/login.component';
import { UserComponent } from 'src/app/user/components/user/user.component';
import { UsersComponent } from 'src/app/user/components/users/users.component';

/* Services */
import { UserService } from 'src/app/user/services/user.service';
@NgModule({
  declarations: [LoginComponent, UserComponent, UsersComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
  providers: [UserService],
})
export class UserModule {}
