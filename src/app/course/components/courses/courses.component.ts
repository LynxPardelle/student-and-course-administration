import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription, firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { UserService } from 'src/app/user/services/user.service';
import { User } from 'src/app/user/models/user';

import { CourseService } from 'src/app/course/services/course.service';
import { Course } from 'src/app/course/models/course';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AppState } from 'src/app/state/app.state';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { CoursesLoaded } from 'src/app/state/actions/course.actions';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [BsModalService, BsModalRef],
})
export class CoursesComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  public identity$!: Observable<User | undefined>;
  public access: string = 'public';
  public columns: string[] = ['title', 'students', 'profesor', 'actions'];
  public ELEMENT_DATA: Course[] = [];
  public dataSource: MatTableDataSource<Course> = new MatTableDataSource(
    this.ELEMENT_DATA
  );
  public editCourseForm: FormGroup;
  public users: User[] = [];
  public coursesSubscription!: Subscription;
  public usersSubscription!: Subscription;
  @ViewChild(MatTable) tabla!: MatTable<User>;

  public filterValue: string = '';
  public filterType: string = '';
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _courseService: CourseService,
    private _befService: BefService,
    private modalService: BsModalService,
    private store: Store<AppState>
  ) {
    this.editCourseForm = this.fb.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      students: [[], [Validators.required]],
      profesor: [null],
      user2Add: [null],
      user2Remove: [null],
    });
    this.coursesSubscription = this._courseService
      .getCourses()
      .pipe(
        map((courses: any[]) =>
          courses.filter((course) =>
            this.filterType === '' && this.filterValue === ''
              ? course
              : this.filterType === '' && this.filterValue !== ''
              ? course.title.includes(this.filterValue) ||
                (course.profesor &&
                  course.profesor.name &&
                  course.profesor.name.includes(this.filterValue)) ||
                (course.students &&
                  course.students[0] &&
                  course.studets.find((student: User) => {
                    return student.name.includes(this.filterValue);
                  }))
              : !course[this.filterType]
              ? false
              : course[this.filterType].includes(this.filterValue)
          )
        )
      )
      .subscribe({
        next: (courses) => {
          console.log(courses);
          if (
            courses[0] &&
            this._courseService.checkIfCourseInterface(courses[0])
          ) {
            this.store.dispatch(CoursesLoaded({ courses: courses }));
            this.ELEMENT_DATA = courses;
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          } else {
            console.error('There are not courses.');
            this.ELEMENT_DATA = [];
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    this._courseService.updateCoursesList();
  }

  ngOnInit(): void {
    // this.debugOptions();
    this.usersSubscription = this._userService
      .getUsers()
      .pipe()
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (err) => console.error(err),
      });
    this._userService.updateUsersList();
    this.identity$ = this.store.select(IdentitySesionSelector);
    this.identity$.subscribe({
      next: (i) => {
        if (!this._userService.checkIfUserInterface(i)) {
          this._router.navigate(['/auth/login']);
        } else {
          this.access = i.role;
        }
      },
      error: (e) => {
        console.error(e);
        this.access = 'public';
      },
      complete: () => (this.access = 'public'),
    });
    this._befService.cssCreate();
  }

  ngOnDestroy(): void {
    this.coursesSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  hasItStudent(user: User, course: Course | null = null): boolean {
    let students =
      course === null
        ? this.editCourseForm.get('students')?.getRawValue()
        : course.students;
    let itHasIt: boolean = false;
    for (let student of students) {
      if (student.id === user.id) {
        itHasIt = true;
      }
    }
    return itHasIt;
  }

  addStudent(data: { user: User; course: Course } | null = null): void {
    let student =
      data === null
        ? this.editCourseForm.get('user2Add')?.getRawValue()
        : data.user;
    let students =
      data === null
        ? this.editCourseForm.get('students')?.getRawValue()
        : data.course.students;
    if (!this.hasItStudent(student, data !== null ? data.course : null)) {
      students.push(student);
      if (data !== null) {
        this.editCourseForm.get('students')?.setValue(students);
      }
      this.edit(false, data !== null ? data.course : null);
    }
    if (data !== null) {
      this.editCourseForm.get('user2Add')?.setValue(null);
    }
  }

  removeStudent(data: { user: User; course: Course } | null = null): void {
    let student =
      data === null
        ? this.editCourseForm.get('user2Remove')?.getRawValue()
        : data.user;
    let students =
      data === null
        ? this.editCourseForm.get('students')?.getRawValue()
        : data.course.students;
    let i: number = -1;
    for (let student2check of students) {
      if (student2check.id === student.id) {
        i = students.indexOf(student2check);
      }
    }
    if (i !== -1) {
      students.splice(i, 1);
      if (data !== null) {
        this.editCourseForm.get('students')?.setValue(students);
      }
      this.edit(false, data !== null ? data.course : null);
    }
    if (data !== null) {
      this.editCourseForm.get('user2Remove')?.setValue(null);
    }
  }

  async edit(dontHide: boolean = true, course: Course | null = null) {
    try {
      let courseUpdated = await firstValueFrom(
        this._courseService.updateCourse(
          course === null
            ? {
                id: this.editCourseForm.get('id')?.getRawValue(),
                title: this.editCourseForm.get('title')?.getRawValue(),
                students: this.editCourseForm.get('students')?.getRawValue(),
                profesor: this.editCourseForm.get('profesor')?.getRawValue(),
              }
            : course
        )
      );
      console.log(courseUpdated);
      if (
        !courseUpdated ||
        !this._courseService.checkIfCourseInterface(courseUpdated)
      ) {
        throw new Error('Curso no actualizado.');
      }
      if (course === null) {
        this.modalRef?.hide();
        this.clearForm();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async delete(element: Course) {
    try {
      let deletedMessage = await lastValueFrom(
        this._courseService.deleteCourse(element.id)
      );
      if (!deletedMessage) {
        throw new Error('No se ha eliminado el curso.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  async setCourseEdit(course: Course) {
    try {
      this.editCourseForm.get('id')?.setValue(course.id);
      this.editCourseForm.get('title')?.setValue(course.title);
      this.editCourseForm.get('students')?.setValue(course.students);
      this.editCourseForm.get('profesor')?.setValue(course.profesor);
    } catch (error) {
      console.error(error);
    }
  }

  openModal(template: TemplateRef<any>, course: Course | null = null) {
    if (course != null) {
      this.setCourseEdit(course);
    }
    this.modalRef = this.modalService.show(template);
  }

  clearForm() {
    this.editCourseForm.get('id')?.setValue('');
    this.editCourseForm.get('title')?.setValue('');
    this.editCourseForm.get('students')?.setValue([]);
    this.editCourseForm.get('profesor')?.setValue(null);
    this.editCourseForm.get('user2Add')?.setValue(null);
    this.editCourseForm.get('user2Remove')?.setValue(null);
  }

  debugOptions() {
    setTimeout(() => {
      this.filterValue = 'Ang';
      console.log(`type: ${this.filterType}, value: ${this.filterValue}`);
      this._courseService.updateCoursesList();
    }, 1000);
    setTimeout(() => {
      this.filterType = 'title';
      this.filterValue = 'Angular';
      console.log(`type: ${this.filterType}, value: ${this.filterValue}`);
      this._courseService.updateCoursesList();
    }, 2000);
    setTimeout(() => {
      this.filterValue = 'NGINX';
      console.log(`type: ${this.filterType}, value: ${this.filterValue}`);
      this._courseService.updateCoursesList();
    }, 3000);
    setTimeout(() => {
      this.filterType = 'profesor.name';
      console.log(`type: ${this.filterType}, value: ${this.filterValue}`);
      this.filterValue = 'Alec';
      this._courseService.updateCoursesList();
    }, 4000);
  }
}
