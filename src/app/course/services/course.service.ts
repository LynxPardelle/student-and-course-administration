import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Course } from 'src/app/course/models/course';
import CourseInterface from 'src/app/course/interfaces/course';
import { UserService } from 'src/app/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  public courses: Course[] = [
    {
      id: 0,
      title: 'Angular',
      students: [
        {
          id: 87,
          name: 'Pancho',
          surname: 'Lopez',
          email: 'pancho@gmail.com',
          password: '',
          role: 'user',
        },
        {
          id: 69,
          name: 'Ang',
          surname: 'Perez',
          email: 'ang@gmail.com',
          password: '',
          role: 'profesor',
        },
      ],
      profesor: null,
    },
    {
      id: 1,
      title: 'NGINX',
      students: [],
      profesor: {
        id: 69,
        name: 'Ang',
        surname: 'Perez',
        email: 'ang@gmail.com',
        password: '',
        role: 'profesor',
      },
    },
  ];
  public coursesSubject: Subject<any> = new Subject();
  public identity: any;

  constructor(private _userService: UserService) {}

  // Create
  createCourse(course: Course): Observable<any> {
    return new Observable<any>((suscriptor) => {
      try {
        if (this.checkIfCourseInterface(course)) {
          course.id = this.courses.length;
          const chekIfCourse = (id: number) => {
            let hasIt: boolean = false;
            for (let course of this.courses) {
              if (course.id === id) {
                hasIt = true;
              }
            }
            if (hasIt === false) {
              return false;
            } else {
              return true;
            }
          };
          while (chekIfCourse(course.id)) {
            course.id++;
          }
          this.courses.push(course);
          suscriptor.next(this.courses[course.id]);
          this.coursesSubject.next(this.courses);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid course.');
        }
      } catch (err) {
        suscriptor.error('Error.');
        console.error(err);
      }
    });
  }

  // Read
  getCourses(): Observable<any> {
    return this.coursesSubject.asObservable();
  }

  updateCoursesList(): void {
    this.coursesSubject.next(this.courses);
  }

  getCourse(id: number | string): Observable<any> {
    return new Observable<any>((suscriptor) => {
      try {
        if (typeof id === 'number') {
          let i: number = -1;
          for (let course of this.courses) {
            if (course.id === id) {
              i = this.courses.indexOf(course);
            }
          }
          if (this.courses[i]) {
            let course = this.courses[i];
            suscriptor.next(course);
            suscriptor.complete();
          } else {
            throw new Error('Not a valid course.');
          }
        } else if (typeof id === 'string') {
          let myCourse: Course | null = null;
          for (let course of this.courses) {
            if (course.title === id) {
              myCourse = course;
            }
          }
          if (myCourse === null) {
            throw new Error('Not a valid course.');
          }
          suscriptor.next(myCourse);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid course.');
        }
      } catch (err) {
        console.error(err);
        suscriptor.error('Error.');
      }
    });
  }

  // Update
  updateCourse(course: Course) {
    return new Observable<any>((suscriptor) => {
      try {
        let id = course.id;
        let i = -1;
        for (let course2check of this.courses) {
          if (course2check.id === id) {
            i = this.courses.indexOf(course2check);
          }
        }
        if (i !== -1) {
          this.courses[i] = course;
          let updatedCourse = this.courses[id];
          suscriptor.next(updatedCourse);
          this.coursesSubject.next(this.courses);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid course.');
        }
      } catch (err) {
        suscriptor.error('Error.');
        console.error(err);
      }
    });
  }

  // Delete
  deleteCourse(id: number) {
    return new Observable<any>((suscriptor) => {
      try {
        let i = -1;
        for (let course2check of this.courses) {
          if (course2check.id === id) {
            i = this.courses.indexOf(course2check);
          }
        }
        if (i !== -1) {
          this.courses.splice(i, 1);
          suscriptor.next('Course deleted.');
          this.coursesSubject.next(this.courses);
          suscriptor.complete();
        } else {
          throw new Error('Not a valid course.');
        }
      } catch (err) {
        suscriptor.error('Error');
        console.error(err);
      }
    });
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
