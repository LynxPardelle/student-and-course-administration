import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public identity: any = null;
  public debugMessage!: string;

  public registerForm = this.fb.group({
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
    this.getIdentity();
    this._befService.cssCreate();
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
}
