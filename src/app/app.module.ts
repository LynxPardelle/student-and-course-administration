import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

/* NGX-Bootstrap-Expanded-Features */
import { NgxBootstrapExpandedFeaturesService } from 'ngx-bootstrap-expanded-features';

/* Components */
import { AppComponent } from './app.component';

/* Main */
import { HomeComponent } from './components/main/home/home.component';

/* User */
import { LoginComponent } from './components/user/login/login.component';
import { UserComponent } from './components/user/user/user.component';
import { UsersComponent } from './components/user/users/users.component';

/* Directives */
import { NgInitDirective } from './directives/ng-init.directive';

/* Pipes */
import { SafeHtmlPipe } from './pipes/safe-html';
@NgModule({
  declarations: [
    AppComponent,

    /* Main */
    HomeComponent,

    /* User */
    LoginComponent,
    UserComponent,
    UsersComponent,
    /* Directives */
    NgInitDirective,

    /* Pipes */
    SafeHtmlPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [NgxBootstrapExpandedFeaturesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
