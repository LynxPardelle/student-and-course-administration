import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/* RsJs */
import { lastValueFrom, Subscription, firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/* Models */
import { User } from 'src/app/user/models/user';
import { Course } from 'src/app/course/models/course';

/* Services */
import { CourseService } from 'src/app/course/services/course.service';
import { UserService } from 'src/app/user/services/user.service';

/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { CoursesState } from '../../interfaces/courses.state';
import { CoursesLoaded, LoadCourses } from '../../state/course.actions';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';

/* NGX-Bootstrap */
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

/* Material */
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UsersState } from 'src/app/user/interfaces/users.state';
import { LoadUsers } from 'src/app/user/state/user.actions';
import { LoadedUsersSelector } from 'src/app/user/state/user.selectors';
import { LoadedCoursesSelector } from '../../state/course.selectors';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [BsModalService, BsModalRef],
})
export class CoursesComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  public identity$: Observable<User | undefined>;
  public access: string = 'public';
  public columns: string[] = ['title', 'students', 'profesor', 'actions'];
  public ELEMENT_DATA: Course[] = [];
  public dataSource: MatTableDataSource<Course> = new MatTableDataSource(
    this.ELEMENT_DATA
  );
  public editCourseForm: FormGroup;
  public users$: Observable<User[]>;
  public courses$: Observable<Course[]>;
  @ViewChild(MatTable) public tabla!: MatTable<User>;

  public filterValue: string = '';
  public filterType: string = '';
  public fb: FormBuilder = new FormBuilder();
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _courseService: CourseService,
    private _befService: BefService,
    private modalService: BsModalService,
    private store: Store<AppState>,
    private coursesStore: Store<CoursesState>,
    private usersStore: Store<UsersState>
  ) {
    this.editCourseForm = this.fb.group({
      id: [0, [Validators.required]],
      title: ['', [Validators.required]],
      students: [[], [Validators.required]],
      profesor: [null],
      user2Add: [null],
      user2Remove: [null],
    });
    this.identity$ = this.store.select(IdentitySesionSelector);
    this.users$ = this.usersStore.select(LoadedUsersSelector);
    this.courses$ = this.coursesStore.select(LoadedCoursesSelector);
    this.courses$
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
          if (
            courses[0] &&
            this._courseService.checkIfCourseInterface(courses[0])
          ) {
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
  }

  ngOnInit(): void {
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
    this.coursesStore.dispatch(LoadCourses());
    this.usersStore.dispatch(LoadUsers());
    this._befService.cssCreate();
  }

  ngOnDestroy(): void {}

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
    let student: User =
      data === null
        ? this.editCourseForm.get('user2Add')?.getRawValue()
        : data.user;
    let students: User[] =
      data === null
        ? this.editCourseForm.get('students')?.getRawValue()
        : data.course.students;
    if (!this.hasItStudent(student, data !== null ? data.course : null)) {
      if (data === null) {
        this.editCourseForm.get('students')?.setValue([...students, student]);
      }
      this.edit(
        false,
        data !== null
          ? {
              id: data.course.id,
              title: data.course.title,
              students: [...students, student],
              profesor: data.course.profesor,
            }
          : null
      );
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
      let nS = [...students];
      nS.splice(i, 1);
      if (data === null) {
        this.editCourseForm.get('students')?.setValue(nS);
      }
      this.edit(
        false,
        data !== null
          ? {
              id: data.course.id,
              title: data.course.title,
              students: nS,
              profesor: data.course.profesor,
            }
          : null
      );
    }
    if (data !== null) {
      this.editCourseForm.get('user2Remove')?.setValue(null);
    }
  }

  edit(dontHide: boolean = true, course: Course | null = null) {
    this._courseService
      .updateCourse(
        course === null
          ? {
              id: this.editCourseForm.get('id')?.getRawValue(),
              title: this.editCourseForm.get('title')?.getRawValue(),
              students: this.editCourseForm.get('students')?.getRawValue(),
              profesor: this.editCourseForm.get('profesor')?.getRawValue(),
            }
          : course
      )
      .subscribe({
        next: (c) => {
          console.log(c);
          if (!this._courseService.checkIfCourseInterface(c)) {
            throw new Error('Curso no actualizado.');
          }
          if (course === null) {
            this.modalRef?.hide();
            this.clearForm();
          }
          this.coursesStore.dispatch(LoadCourses());
        },
        error: (e) => {
          console.error(e);
        },
      });
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
    this.editCourseForm.get('id')?.setValue(course.id);
    this.editCourseForm.get('title')?.setValue(course.title);
    this.editCourseForm.get('students')?.setValue(course.students);
    this.editCourseForm.get('profesor')?.setValue(course.profesor);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  clearForm() {
    this.editCourseForm.get('id')?.setValue(0);
    this.editCourseForm.get('title')?.setValue('');
    this.editCourseForm.get('students')?.setValue([]);
    this.editCourseForm.get('profesor')?.setValue(null);
    this.editCourseForm.get('user2Add')?.setValue(null);
    this.editCourseForm.get('user2Remove')?.setValue(null);
  }
}
