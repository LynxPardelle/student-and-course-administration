import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/user/models/user';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Course } from 'src/app/course/models/course';
import { CourseService } from 'src/app/course/services/course.service';
import { UserService } from 'src/app/user/services/user.service';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public roleOptions: string[] = ['user', 'profesor', 'admin'];
  public user: User = {
    id: -1,
    name: '',
    surname: '',
    email: '',
    password: '',
    role: this.roleOptions[0],
  };
  public identity$!: Observable<User | undefined>;
  public access: string = 'public';
  public editUserForm: FormGroup;

  public columns: string[] = ['title', 'students', 'profesor', 'actions'];
  public ELEMENT_DATA: Course[] = [];
  public dataSource: MatTableDataSource<Course> = new MatTableDataSource(
    this.ELEMENT_DATA
  );

  public courses: Course[] = [];
  public isEdit: boolean = true;
  public showCourses: boolean = false;
  @ViewChild(MatTable) tabla!: MatTable<Course>;
  constructor(
    private store: Store<AppState>,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _befService: BefService,
    private _authService: AuthService,
    private _courseService: CourseService,
    private _userService: UserService
  ) {
    this.editUserForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(7)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(64),
          Validators.minLength(4),
        ],
      ],
      role: [this.roleOptions[0], [Validators.required]],
    });
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
    });
  }

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params) => {
        if (params['id']) {
          this._userService.getUser(parseInt(params['id'])).subscribe({
            next: (user) => {
              this.isEdit = false;
              this.user = user;
              this.setUserForm();
              this._courseService.updateCoursesList();
              /*
               */
            },
            error: (error) => console.error(error),
          });
        } else if (this.access !== 'admin' && this.access !== 'profesor') {
          this._router.navigate(['auth/login']);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
    this._courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        let studentCourses =
          this.user.id >= 0
            ? courses.filter((course: Course) => {
                return course.students.find((student) => {
                  return student.id === this.user.id;
                })
                  ? course
                  : null;
              })
            : [];
        this.ELEMENT_DATA = studentCourses ? studentCourses : [];
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.showCourses = !!this.ELEMENT_DATA[0];
      },
      error: (error) => console.error(error),
    });
    this._courseService.updateCoursesList();
    this.cssCreate();
  }

  setUserForm(clear: boolean = false) {
    if (!clear) {
      this.editUserForm.get('id')?.setValue(this.user.id);
      this.editUserForm.get('name')?.setValue(this.user.name);
      this.editUserForm.get('surname')?.setValue(this.user.surname);
      this.editUserForm.get('email')?.setValue(this.user.email);
      this.editUserForm.get('password')?.setValue(this.user.password);
      this.editUserForm.get('role')?.setValue(this.user.role);
    } else {
      this.editUserForm.get('id')?.setValue(-1);
      this.editUserForm.get('name')?.setValue('');
      this.editUserForm.get('surname')?.setValue('');
      this.editUserForm.get('email')?.setValue('');
      this.editUserForm.get('password')?.setValue('');
      this.editUserForm.get('role')?.setValue('');
    }
  }

  submit() {
    let user = {
      id: this.editUserForm.get('id')?.getRawValue(),
      name: this.editUserForm.get('name')?.getRawValue(),
      surname: this.editUserForm.get('surname')?.getRawValue(),
      email: this.editUserForm.get('email')?.getRawValue(),
      password: this.editUserForm.get('password')?.getRawValue(),
      role: this.editUserForm.get('role')?.getRawValue(),
    };
    if (this.user.id >= 0) {
      this._userService.updateUser(user).subscribe({
        next: (user) => {
          this.isEdit = false;
          this.user = user;
          this.setUserForm();
          this._courseService.updateCoursesList();
        },
        error: (error) => console.error(error),
      });
    }
  }

  allCoursesHasIt() {
    return (
      this.courses.filter((c) => {
        return this.hasItStudent(this.user, c);
      }).length === this.courses.length
    );
  }

  hasItStudent(user: User, course: Course): boolean {
    return !!course.students.find((s) => {
      return s.id === user.id;
    });
  }

  addStudent(course: Course): void {
    if (!this.hasItStudent(this.user, course)) {
      course.students.push(this.user);
      this.editCourse(course);
    }
  }

  removeStudent(course: Course): void {
    let i: number = -1;
    for (let student2check of course.students) {
      if (student2check.id === this.user.id) {
        i = course.students.indexOf(student2check);
      }
    }
    if (i !== -1) {
      course.students.splice(i, 1);
      this.editCourse(course);
    }
  }

  editCourse(course: Course) {
    this._courseService.updateCourse(course).subscribe({
      next: (course) => {
        this._courseService.updateCoursesList();
      },
      error: (error) => console.error(error),
    });
  }

  changeEditOption() {
    this.isEdit =
      this.access === 'admin' || this.access === 'profesor'
        ? !this.isEdit
        : false;
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
