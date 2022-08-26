import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from 'src/app/course/models/course';
import { CourseService } from 'src/app/course/services/course.service';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/user/models/user';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  public course: Course = {
    id: -1,
    title: '',
    students: [],
    profesor: null,
  };
  public identity: any = null;
  public editCourseForm: FormGroup;

  public columns: string[] = ['name', 'actions'];
  public ELEMENT_DATA: User[] = [];
  public dataSource: MatTableDataSource<User> = new MatTableDataSource(
    this.ELEMENT_DATA
  );
  public showStudents: boolean = false;

  public users: User[] = [];
  public isEdit: boolean = true;
  @ViewChild(MatTable) tabla!: MatTable<Course>;
  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,

    private _befService: BefService,

    private _courseService: CourseService,
    private _userService: UserService
  ) {
    this.editCourseForm = this.fb.group({
      id: [-1, [Validators.required]],
      title: ['', [Validators.required]],
      students: [[]],
      profesor: [null],
      user2Add: [null],
      user2Remove: [null],
    });
  }

  ngOnInit(): void {
    this.getIdentity();
    this._route.params.subscribe(
      (params) => {
        if (params['id']) {
          this._courseService.getCourse(parseInt(params['id'])).subscribe({
            next: (course) => {
              this.isEdit = false;
              this.course = course;
              this.setCourseForm();
              if (this.course.students[0]) {
                this.ELEMENT_DATA = this.course.students;
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                this.showStudents = !!this.ELEMENT_DATA[0];
              }
            },
            error: (error) => console.error(error),
          });
        } else if (
          !this.identity ||
          !this.identity.role ||
          (this.identity.role !== 'admin' && this.identity.role !== 'profesor')
        ) {
          this._router.navigate(['login']);
        }
      },
      (error) => {
        console.error(error);
      }
    );
    if (this.identity && this.identity.role && this.identity.role === 'admin') {
      this._userService.getUsers().subscribe({
        next: (users) => (this.users = users),
        error: (error) => console.error(error),
      });
    }
  }

  setCourseForm(clear: boolean = false) {
    if (!clear) {
      this.editCourseForm.get('id')?.setValue(this.course.id);
      this.editCourseForm.get('title')?.setValue(this.course.title);
      this.editCourseForm.get('students')?.setValue(this.course.students);
      this.editCourseForm.get('profesor')?.setValue(this.course.profesor);
    } else {
      this.editCourseForm.get('id')?.setValue(-1);
      this.editCourseForm.get('title')?.setValue('');
      this.editCourseForm.get('students')?.setValue([]);
      this.editCourseForm.get('profesor')?.setValue(null);
    }
  }

  submit() {
    let course = {
      id: this.editCourseForm.get('id')?.getRawValue(),
      title: this.editCourseForm.get('title')?.getRawValue(),
      students: this.editCourseForm.get('students')?.getRawValue(),
      profesor: this.editCourseForm.get('profesor')?.getRawValue(),
    };
    if (this.course.id >= 0) {
      this._courseService.updateCourse(course).subscribe({
        next: (course) => {
          this.isEdit = false;
          this.course = course;
          this.setCourseForm();
          if (this.course.students[0]) {
            this.ELEMENT_DATA = this.course.students;
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.showStudents = !!this.ELEMENT_DATA[0];
          }
        },
        error: (error) => console.error(error),
      });
    } else {
      this._courseService.createCourse(course).subscribe({
        next: (course) => {
          this.isEdit = false;
          this.course = course;
          this.setCourseForm();
          if (this.course.students[0]) {
            this.ELEMENT_DATA = this.course.students;
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.showStudents = !!this.ELEMENT_DATA[0];
          }
        },
        error: (error) => console.error(error),
      });
    }
  }

  hasItStudent(user: User): boolean {
    let students = this.editCourseForm.get('students')?.getRawValue();
    let itHasIt: boolean = false;
    for (let student of students) {
      if (student.id === user.id) {
        itHasIt = true;
      }
    }
    return itHasIt;
  }

  addStudent(user: User | null = null): void {
    let student =
      user === null ? this.editCourseForm.get('user2Add')?.getRawValue() : user;
    let students = this.editCourseForm.get('students')?.getRawValue();
    if (!this.hasItStudent(student)) {
      students.push(student);
      this.editCourseForm.get('students')?.setValue(students);
      this.submit();
    }
    if (!user) {
      this.editCourseForm.get('user2Add')?.setValue(null);
    }
  }

  removeStudent(user: User | null = null): void {
    let student =
      user === null
        ? this.editCourseForm.get('user2Remove')?.getRawValue()
        : user;
    let students = this.editCourseForm.get('students')?.getRawValue();
    let i: number = -1;
    for (let student2check of students) {
      if (student2check.id === student.id) {
        i = students.indexOf(student2check);
      }
    }
    if (i !== -1) {
      students.splice(i, 1);
      this.editCourseForm.get('students')?.setValue(students);

      this.submit();
    }
    if (user !== null) {
      this.editCourseForm.get('user2Remove')?.setValue(null);
    }
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getIdentity() {
    let identity = this._userService.getIdentity();
    if (identity !== null) {
      this.identity = identity;
    }
  }

  changeEditOption() {
    this.isEdit =
      this.identity &&
      this.identity.role &&
      (this.identity.role === 'admin' || this.identity.role === 'profesor')
        ? !this.isEdit
        : false;
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
