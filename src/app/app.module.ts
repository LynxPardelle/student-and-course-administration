import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/* NGX-Bootstrap */
import { ModalModule } from 'ngx-bootstrap/modal';

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

/* Course */
import { CoursesComponent } from './components/course/courses/courses.component';
import { CourseComponent } from './components/course/course/course.component';

/* Directives */
import { NgInitDirective } from './directives/ng-init.directive';
import { Titles20Directive } from './directives/titles20.directive';

/* Pipes */
import { SafeHtmlPipe } from './pipes/safe-html';
import { NameParserPipe } from './pipes/name-parser.pipe';

@NgModule({
  declarations: [
    AppComponent,

    /* Main */
    HomeComponent,

    /* User */
    LoginComponent,
    UserComponent,
    UsersComponent,

    /* Course */
    CoursesComponent,
    CourseComponent,

    /* Directives */
    NgInitDirective,
    Titles20Directive,

    /* Pipes */
    SafeHtmlPipe,
    NameParserPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    /* Material */
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,

    /* NGX-Bootstrap */
    ModalModule.forRoot(),
  ],
  providers: [NgxBootstrapExpandedFeaturesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
