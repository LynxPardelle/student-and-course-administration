import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { UserRoutingModule } from 'src/app/user/user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

/* Components */
import { UserComponent } from 'src/app/user/components/user/user.component';
import { UsersComponent } from 'src/app/user/components/users/users.component';

/* Store */
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUser from './state/user.reducer';
import { UserEffects } from './state/user.effects';

@NgModule({
  declarations: [UserComponent, UsersComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromUser.userFeatureKey, fromUser.UserReducer),
    EffectsModule.forFeature([UserEffects]),
  ],
})
export class UserModule {}
