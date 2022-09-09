import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/* RxJs */
import { lastValueFrom, Observable } from 'rxjs';

/* Models */
import { User } from 'src/app/user/models/user';

/* Services */
import { UserService } from 'src/app/user/services/user.service';

/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { UsersState } from 'src/app/user/interfaces/users.state';
import { LoadSesion } from 'src/app/state/actions/sesion.actions';
import { LoadUsers } from 'src/app/user/state/user.actions';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public identity$: Observable<User | undefined>;
  public debugMessage!: string;
  public isRegister: boolean = false;

  public roleOptions: string[] = ['user', 'profesor', 'admin'];

  public loginForm = this.fb.group({
    name: [''],
    surname: [''],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(7)],
    ],
    password: [
      '',
      [Validators.required, Validators.maxLength(64), Validators.minLength(4)],
    ],
    role: [this.roleOptions[0]],
  });

  constructor(
    private store: Store<AppState>,
    private usersStore: Store<UsersState>,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _befService: BefService,
    private _userService: UserService
  ) {
    this.identity$ = this.store.select(IdentitySesionSelector);
  }

  ngOnInit(): void {
    if (this._route.snapshot?.routeConfig?.path === 'register') {
      this.isRegister = true;
      this.loginForm.get('name')?.addValidators([Validators.required]);
      this.loginForm.get('surname')?.addValidators([Validators.required]);
      this.loginForm.get('role')?.addValidators([Validators.required]);
    }
    this.cssCreate();
  }

  async submit() {
    if (this.loginForm.valid) {
      this.debugMessage = 'Enviando los datos...';
      if (!this.isRegister) {
        this._userService
          .login(
            this.loginForm.get('email')?.getRawValue(),
            this.loginForm.get('password')?.getRawValue()
          )
          .subscribe({
            next: (i) => {
              if (!this._userService.checkIfUserInterface(i)) {
                throw new Error('No hay usuario.');
              }
              localStorage.setItem('identitySACA', i.id.toString());
              this.store.dispatch(LoadSesion());
              this.debugMessage = `Te damos la bienvenida ${i.name}. 😊`;
              setTimeout(() => {
                this._router.navigate(['/home']);
              }, 1000);
            },
            error: (e) => {
              this.debugMessage =
                'Error, no se encontró el usuario o la contraseña esta mal escrita.';
              console.error(e);
            },
          });
      } else {
        await setTimeout(async () => {
          try {
            let newUser = await this._userService.register({
              id: 0,
              name: this.loginForm.get('name')?.getRawValue(),
              surname: this.loginForm.get('surname')?.getRawValue(),
              email: this.loginForm.get('email')?.getRawValue(),
              password: this.loginForm.get('password')?.getRawValue(),
              role: this.loginForm.get('role')?.getRawValue(),
            });
            this.usersStore.dispatch(LoadUsers());
            if (!newUser || !this._userService.checkIfUserInterface(newUser)) {
              throw new Error('Usuario Registrado.');
            }
            this.debugMessage = 'Usuario Registrado.';
          } catch (error) {
            this.debugMessage = 'Hubo un error en la creación del usuario.';
            console.error(error);
          }
        }, 1000);
      }
      this.cssCreate();
    } else {
      this.debugMessage = 'Hay datos inválidos en el formulario.';
      this.cssCreate();
    }
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
