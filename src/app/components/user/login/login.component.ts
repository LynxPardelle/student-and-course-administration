import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public message!: string;

  public loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(7)],
    ],
    password: [
      '',
      [Validators.required, Validators.maxLength(64), Validators.minLength(4)],
    ],
  });

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private _befService: BefService
  ) {}

  ngOnInit(): void {
    this._befService.cssCreate();
  }

  submit() {
    if (this.loginForm.valid) {
      this.message = 'Enviando los datos...';
      setTimeout(() => {
        let identity = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        };
        console.log(identity);
        localStorage.setItem('identitySACA', JSON.stringify(identity));

        this.message = `Te damos la bienvenida ${identity.email}. 😊`;

        setTimeout(()=>{
          this._router.navigate(['/home']);
        }, 1000);
      }, 1000);
      this._befService.cssCreate();
    } else {
      this.message = 'Hay datos inválidos en el formulario.';
      this._befService.cssCreate();
    }
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
