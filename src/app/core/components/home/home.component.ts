import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/user/services/user.service';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { User } from 'src/app/user/models/user';
import { Store } from '@ngrx/store';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public identity$!: Observable<User | undefined>;
  public access: string = 'public';

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _route: ActivatedRoute,
    private _befService: BefService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
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
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
