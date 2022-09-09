import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { CourseRoutingModule } from 'src/app/course/course-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

/* Components */
import { CoursesComponent } from 'src/app/course/components/courses/courses.component';
import { CourseComponent } from 'src/app/course/components/course/course.component';

/* Services */
import { CourseService } from 'src/app/course/services/course.service';

/* Store */
import { StoreModule } from '@ngrx/store';
import * as fromCourse from './state/course.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CourseEffects } from './state/course.effects';
@NgModule({
  declarations: [CoursesComponent, CourseComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      fromCourse.courseFeatureKey,
      fromCourse.CourseReducer
    ),
    EffectsModule.forFeature([CourseEffects]),
  ],
  providers: [CourseService],
})
export class CourseModule {}
