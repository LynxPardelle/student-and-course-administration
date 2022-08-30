import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course } from 'src/app/course/models/course';
import CourseInterface from 'src/app/course/interfaces/course';
import { UserService } from 'src/app/user/services/user.service';
import Enviroment from 'src/app/environments/enviroment';
import { User } from 'src/app/user/models/user';
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  public courses: Course[] = [];
  public coursesSubject: Subject<any> = new Subject();
  public identity: any;
  private api = Enviroment.api;

  constructor(private _userService: UserService, private _http: HttpClient) {}

  // Create
  createCourse(course: Course): Observable<Course> {
    try {
      if (this.checkIfCourseInterface(course)) {
        course.id = this.courses.length;
        while (
          this.courses.find((courseO) => {
            return typeof courseO.id === 'string'
              ? parseInt(courseO.id) === course.id
              : courseO.id === course.id;
          })
        ) {
          course.id++;
        }
        this.updateCoursesList();
        return this._http.post<Course>(`${this.api}/Course/`, course);
      } else {
        throw new Error('Not a valid course.');
      }
    } catch (err) {
      console.error(err);
      return new Observable<any>((suscriptor) => {
        suscriptor.error(err);
      });
    }
  }

  // Read
  getCourses(): Observable<Course[]> {
    return this.coursesSubject.asObservable();
  }

  updateCoursesList(): void {
    this._http
      .get<Course[]>(`${this.api}/Course`, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .subscribe({
        next: (courses) => {
          this.courses = courses.map((course) => {
            if (typeof course.id === 'string') {
              course.id = parseInt(course.id);
            }
            return course;
          });
          this.coursesSubject.next(this.courses);
        },
        error: (err) => {
          this.courses = [];
          console.error(err);
          this.coursesSubject.next(this.courses);
          this.coursesSubject.error('Error.');
        },
      });
  }

  getCourse(id: number | string): Observable<Course> {
    if (typeof id === 'number') {
      id.toString();
    }
    return this._http.get<Course>(`${this.api}/Course/${id}`, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        encoding: 'UTF-8',
      }),
    });
  }

  // Update
  updateCourse(course: Course): Observable<Course> {
    let courseSubject: Subject<any> = new Subject();
    this._http
      .put<Course>(`${this.api}/Course/${course.id.toString()}`, course)
      .subscribe({
        next: (course) => {
          this.updateCoursesList();
          courseSubject.next(course);
        },
        error: (err) => {
          this.updateCoursesList();
          console.error(err);
          courseSubject.error(err);
        },
        complete: () => {
          this.updateCoursesList();
          courseSubject.complete();
        },
      });
    return courseSubject.asObservable();
  }

  // Delete
  deleteCourse(id: number) {
    let courseSubject: Subject<any> = new Subject();
    this._http.delete<Course>(`${this.api}/Course/${id.toString()}`).subscribe({
      next: () => {
        this.updateCoursesList();
        courseSubject.next('Course deleted.');
      },
      error: (err) => {
        this.updateCoursesList();
        console.error(err);
        courseSubject.error(err);
      },
      complete: () => {
        this.updateCoursesList();
        courseSubject.complete();
      },
    });
    return courseSubject.asObservable();
  }

  // Utility
  checkIfCourseInterface(course: any): course is CourseInterface {
    return (
      (<CourseInterface>course).id !== undefined &&
      (<CourseInterface>course).title !== undefined &&
      (<CourseInterface>course).students !== undefined &&
      (<CourseInterface>course).profesor !== undefined
    );
  }
}
