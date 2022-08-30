import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { UserService } from 'src/app/user/services/user.service';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public identity: any = null;
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
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _befService: BefService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    if (
      this._route.snapshot.routeConfig &&
      this._route.snapshot.routeConfig.path &&
      this._route.snapshot.routeConfig.path === 'register'
    ) {
      this.isRegister = true;
      this.loginForm.get('name')?.addValidators([Validators.required]);
      this.loginForm.get('surname')?.addValidators([Validators.required]);
      this.loginForm.get('role')?.addValidators([Validators.required]);
    }
    this.getIdentity();
    this._befService.cssCreate();
  }

  async submit() {
    if (this.loginForm.valid) {
      this.debugMessage = 'Enviando los datos...';
      if (!this.isRegister) {
        await setTimeout(async () => {
          try {
            const identity = await lastValueFrom(
              this._userService.login(
                this.loginForm.get('email')?.getRawValue(),
                this.loginForm.get('password')?.getRawValue()
              )
            );
            if (
              !identity ||
              !this._userService.checkIfUserInterface(identity)
            ) {
              throw new Error('There is no user');
            }
            localStorage.setItem('identitySACA', JSON.stringify(identity));

            this.debugMessage = `Te damos la bienvenida ${identity.name}. 😊`;

            setTimeout(() => {
              this._router.navigate(['/home']);
            }, 1000);
          } catch (error) {
            this.debugMessage =
              'Error, no se encontró el usuario o la contraseña esta mal escrita.';
            console.log(error);
          }
        }, 1000);
      } else {
        await setTimeout(async () => {
          try {
            let newUser = await lastValueFrom(
              this._userService.register({
                id: 0,
                name: this.loginForm.get('name')?.getRawValue(),
                surname: this.loginForm.get('surname')?.getRawValue(),
                email: this.loginForm.get('email')?.getRawValue(),
                password: this.loginForm.get('password')?.getRawValue(),
                role: this.loginForm.get('role')?.getRawValue(),
              })
            );
            console.log(newUser);
            if (!newUser || !this._userService.checkIfUserInterface(newUser)) {
              throw new Error('User not registered.');
            }
            this.debugMessage = 'Usuario Registrado.';
          } catch (error) {
            this.debugMessage = 'Hubo un error en la creación del usuario.';
            console.log(error);
          }
        }, 1000);
      }
      this._befService.cssCreate();
    } else {
      this.debugMessage = 'Hay datos inválidos en el formulario.';
      this._befService.cssCreate();
    }
  }

  getIdentity() {
    let identity = localStorage.getItem('identitySACA');
    if (identity !== null) {
      identity = JSON.parse(identity);
      this.identity = identity;
    }
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
