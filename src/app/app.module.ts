import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* Shared Module */
import { SharedModule } from './shared/shared.module';

/* Feature Modules */
import { AuthModule } from 'src/app/auth/auth.module';
import { UserModule } from 'src/app/user/user.module';
import { CourseModule } from 'src/app/course/course.module';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/app/core/components/home/home.component';

/* Services */
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/services/user.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

/* State */
import { ROOT_REDUCERS } from 'src/app/state/app.state';
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    /* Shared Module */
    SharedModule,
    /* Feature Modules */
    AuthModule,
    UserModule,
    CourseModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'CourseStudents',
    }),
  ],
  providers: [AuthService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
