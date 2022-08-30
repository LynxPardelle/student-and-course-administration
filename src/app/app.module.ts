import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';

/* Feature Modules */
import { UserModule } from 'src/app/user/user.module';
import { CourseModule } from 'src/app/course/course.module';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/app/core/components/home.component';

/* Services */
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/services/user.service';
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,

    /* Feature Modules */
    UserModule,
    CourseModule,
  ],
  providers: [AuthService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
