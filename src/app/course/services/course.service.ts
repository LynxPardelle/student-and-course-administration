import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* RxJs */
import { firstValueFrom, lastValueFrom, map, Observable, Subject } from 'rxjs';

/* Environment */
import { environment } from 'src/environments/environment';

/* Interfaces */
import CourseInterface from 'src/app/course/interfaces/course';

/* Models */
import { Course } from 'src/app/course/models/course';
import { Store } from '@ngrx/store';
import { CoursesState } from '../interfaces/courses.state';
import { LoadedCoursesSelector } from '../state/course.selectors';

/* Store */
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  public courses$: Observable<Course[]>;
  private readonly api = environment.api;

  constructor(
    private _http: HttpClient,
    private coursesStore: Store<CoursesState>
  ) {
    this.courses$ = this.coursesStore.select(LoadedCoursesSelector);
  }

  // Create
  async createCourse(course: Course): Promise<Course> {
    while (
      await firstValueFrom(
        this.courses$.pipe(
          map((courses: Course[]) => {
            return courses.find((c) => c.id === course.id);
          })
        )
      )
    ) {
      course.id++;
    }
    return lastValueFrom(
      this._http.post<Course>(`${this.api}/Course/`, course)
    );
  }

  // Read
  getCourses(): Observable<Course[]> {
    return this._http.get<Course[]>(`${this.api}/Course`, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        encoding: 'UTF-8',
      }),
    });
  }

  getCourse(id: number | string): Observable<Course> {
    return this._http
      .get<Course>(`${this.api}/Course/${id}`, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(
        map((c: Course) => {
          if (typeof c.id === 'string') {
            c.id = parseInt(c.id);
          }
          for (let s of c.students) {
            s.password = '';
          }
          if (c.profesor && c.profesor.password) {
            c.profesor.password = '';
          }
          return c;
        })
      );
  }

  // Update
  updateCourse(course: Course): Observable<Course> {
    return this._http.put<Course>(
      `${this.api}/Course/${course.id.toString()}`,
      course
    );
  }

  // Delete
  deleteCourse(id: number) {
    return this._http.delete<Course>(`${this.api}/Course/${id.toString()}`);
  }

  // Utility
  checkIfCourseInterface(course: any): course is CourseInterface {
    return (
      <CourseInterface>course !== undefined &&
      (<CourseInterface>course).id !== undefined &&
      (<CourseInterface>course).title !== undefined &&
      (<CourseInterface>course).students !== undefined &&
      (<CourseInterface>course).profesor !== undefined
    );
  }
}
