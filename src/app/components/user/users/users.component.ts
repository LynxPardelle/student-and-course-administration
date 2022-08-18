import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  modalRef?: BsModalRef;
  public identity: any = null;
  public columns: string[] = ['name', 'role', 'actions'];
  public ELEMENT_DATA: User[] = [];
  public dataSource: MatTableDataSource<User> = new MatTableDataSource(
    this.ELEMENT_DATA
  );
  public editUserForm: FormGroup;
  public roleOptions: string[] = ['user', 'profesor', 'admin'];
  @ViewChild(MatTable) tabla!: MatTable<User>;
  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _befService: BefService,
    private modalService: BsModalService
  ) {
    this.editUserForm = this.fb.group({
      id: ['',[Validators.required]],
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
  }

  ngOnInit(): void {
    this.getUsers();
    this.getIdentity();
    this._befService.cssCreate();
  }

  getUsers() {
    (async () => {
      try {
        let ELEMENT_DATA = await lastValueFrom(this._userService.getUsers());
        if (
          !ELEMENT_DATA ||
          (ELEMENT_DATA[0] &&
            !this._userService.checkIfUserInterface(ELEMENT_DATA[0]))
        ) {
          throw new Error('There are not users.');
        }
        this.ELEMENT_DATA = ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      } catch (error) {
        console.error(error);
      }
    })();
  }

  async edit() {
    try {
      let userUpdated = await lastValueFrom(
        this._userService.updateUser({
          id: this.editUserForm.get('id')?.getRawValue(),
          name: this.editUserForm.get('name')?.getRawValue(),
          surname: this.editUserForm.get('surname')?.getRawValue(),
          email: this.editUserForm.get('email')?.getRawValue(),
          password: this.editUserForm.get('password')?.getRawValue(),
          role: this.editUserForm.get('role')?.getRawValue(),
        })
      );
      console.log(userUpdated);
      if (
        !userUpdated ||
        !this._userService.checkIfUserInterface(userUpdated)
      ) {
        throw new Error('Usuario no actualizado.');
      }
      this.modalRef?.hide();
      this.clearForm();
      this.getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async delete(element: User) {
    try {
      let deletedMessage = await lastValueFrom(
        this._userService.deleteUser(element.id)
      );
      if (!deletedMessage) {
        throw new Error('No se ha eliminado el usuario.');
      }
      this.getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  filter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getIdentity() {
    let identity = localStorage.getItem('identitySACA');
    if (identity !== null) {
      identity = JSON.parse(identity);
      this.identity = identity;
      console.log(this.identity);
    } else {
      this._router.navigate(['/login']);
    }
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  async setUserEdit(user: User) {
    try {
      if (user.password === '' && this.identity.role === 'admin') {
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

  openModal(template: TemplateRef<any>, user: User | null = null) {
    if (user != null) {
      this.setUserEdit(user);
    }
    this.modalRef = this.modalService.show(template);
  }

  clearForm() {
    this.editUserForm.get('id')?.setValue('');
    this.editUserForm.get('name')?.setValue('');
    this.editUserForm.get('surname')?.setValue('');
    this.editUserForm.get('email')?.setValue('');
    this.editUserForm.get('password')?.setValue('');
    this.editUserForm.get('role')?.setValue('');
  }
}
