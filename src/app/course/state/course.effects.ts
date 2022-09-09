import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, map, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import * as CourseActions from './course.actions';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course';

@Injectable()
export class CourseEffects {
  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.LoadCourses),
      mergeMap(() =>
        this._courseService.getCourses().pipe(
          map((c: Course[]) => {
            c = c.map((course) => {
              if (typeof course.id === 'string') {
                course.id = parseInt(course.id);
              }
              for (let s of course.students) {
                s.password = '';
              }
              if (course.profesor && course.profesor.password) {
                course.profesor.password = '';
              }
              return course;
            });
            return CourseActions.CoursesLoaded({ courses: c });
          })
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private _courseService: CourseService
  ) {}
}
