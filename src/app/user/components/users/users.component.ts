import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

/* RxJs */
import {
  Subscription,
  lastValueFrom,
  Observable,
  map,
  filter,
  firstValueFrom,
} from 'rxjs';

/* Models */
import { User } from 'src/app/user/models/user';

/* Services */
import { UserService } from 'src/app/user/services/user.service';

/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { UsersState } from '../../interfaces/users.state';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';
import {
  LoadedUsersSelector,
  LoadingUsersSelector,
} from '../../state/user.selectors';
import { LoadUsers, UsersLoaded } from '../../state/user.actions';

/* NGX-Bootstrap */
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { LoadSesion } from 'src/app/state/actions/sesion.actions';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [BsModalService, BsModalRef],
})
export class UsersComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  public users$!: Observable<User[]>;
  public identity$: Observable<User | undefined>;
  public access: string = 'public';
  public columns: string[] = ['name', 'role', 'actions'];
  public ELEMENT_DATA: User[] = [];
  public dataSource: MatTableDataSource<User> = new MatTableDataSource(
    this.ELEMENT_DATA
  );
  public editUserForm: FormGroup;
  public roleOptions: string[] = ['user', 'profesor', 'admin'];
  public usersSubscription!: Subscription;
  public search: string | null = null;
  @ViewChild(MatTable) tabla!: MatTable<User>;
  constructor(
    private store: Store<AppState>,
    private usersStore: Store<UsersState>,
    private fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _befService: BefService,
    private modalService: BsModalService
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
      role: [this.roleOptions[0]],
    });
    this.identity$ = this.store.select(IdentitySesionSelector);
    this.users$ = this.usersStore.select(LoadedUsersSelector);
  }

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (p) => {
        this.search = p['search'] ? p['search'] : null;
      },
      error: (e) => console.error(e),
    });
    this.getAccessToken();
    this.getUSers();
    this.usersStore.dispatch(LoadUsers());
    this.cssCreate();
  }

  getUSers() {
    this.users$.subscribe({
      next: (users) => {
        if (this.search !== null) {
          let search = new RegExp(`${this.search}`, 'i');
          users = users.filter(
            (u: User) =>
              search.test(u.name) ||
              search.test(u.surname) ||
              search.test(u.email)
          );
        }
        this.ELEMENT_DATA = users;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      },
      error: (e) => console.error(e),
    });
  }

  getAccessToken() {
    this.identity$.subscribe({
      next: (i) => {
        if (this._userService.checkIfUserInterface(i)) {
          this.access = i.role;
        } else {
          this._router.navigate(['/auth/login']);
        }
      },
      error: (e) => {
        console.error(e);
        this.access = 'public';
      },
    });
  }

  ngOnDestroy(): void {}

  async edit() {
    try {
      let userUpdated = await this._userService.updateUser({
        id: this.editUserForm.get('id')?.getRawValue(),
        name: this.editUserForm.get('name')?.getRawValue(),
        surname: this.editUserForm.get('surname')?.getRawValue(),
        email: this.editUserForm.get('email')?.getRawValue(),
        password: this.editUserForm.get('password')?.getRawValue(),
        role: this.editUserForm.get('role')?.getRawValue(),
      });
      if (
        !userUpdated ||
        !this._userService.checkIfUserInterface(userUpdated)
      ) {
        throw new Error('Usuario no actualizado.');
      }
      this.users$ = this.usersStore.select(LoadedUsersSelector);
      this.modalRef?.hide();
      this.clearForm();
    } catch (error) {
      console.error(error);
    }
  }

  delete(user: User) {
    this._userService.deleteUser(user.id).subscribe({
      next: (deletedMessage) => {},
      error: (error) => console.error(error),
    });
  }

  filter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  async setUserEdit(user: User) {
    try {
      if (user.password === '' && this.access === 'admin') {
        const user2Check = await lastValueFrom(
          this._userService.getUser(user.id)
        );
        if (
          !user2Check ||
          !this._userService.checkIfUserInterface(user2Check)
        ) {
          throw new Error('Usuario inválido.');
        }
        user = user2Check;
      }
      this.editUserForm.get('id')?.setValue(user.id);
      this.editUserForm.get('name')?.setValue(user.name);
      this.editUserForm.get('surname')?.setValue(user.surname);
      this.editUserForm.get('email')?.setValue(user.email);
      this.editUserForm.get('password')?.setValue(user.password);
      this.editUserForm.get('role')?.setValue(user.role);
    } catch (error) {
      console.error(error);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  clearForm() {
    this.editUserForm.get('id')?.setValue(0);
    this.editUserForm.get('name')?.setValue('');
    this.editUserForm.get('surname')?.setValue('');
    this.editUserForm.get('email')?.setValue('');
    this.editUserForm.get('password')?.setValue('');
    this.editUserForm.get('role')?.setValue('');
  }
}
