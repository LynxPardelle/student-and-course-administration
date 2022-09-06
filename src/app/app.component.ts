import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { UserService } from 'src/app/user/services/user.service';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { AuthService } from './auth/services/auth.service';
import { AppState } from './state/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './user/models/user';
import { IdentitySesionSelector } from './state/selectors/sesion.selector';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public identity$!: Observable<User | undefined>;
  public access: string = 'public';
  public ComponentRoot: string = 'AppComponent';

  public title = 'Student and Course Administration';
  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _befService: BefService,
    private _authService: AuthService,
    private _userService: UserService
  ) {
    this._authService.checkForSesion();
  }

  ngOnInit(): void {
    this.identity$ = this.store.select(IdentitySesionSelector);
    this.identity$.subscribe({
      next: (i) => {
        if (!this._userService.checkIfUserInterface(i)) {
          this._router.navigate(['/auth/login']);
          this.access = 'public';
        } else {
          this.access = i.role;
          if (this._router.url.includes('login')) {
            this._location.back();
          }
        }
      },
      error: (e) => {
        this.access = 'public';
        console.error(e);
      },
      complete: () => console.info('identity$ completed'),
    });
    this._route.url.subscribe({
      next: (f) => {
        console.log(f);
      },
    });
    this.cssCreate();
  }

  onActivate(event: any) {
    this.ComponentRoot = event._route.component.name;
  }

  onDeactivate(event: any) {
    this.ComponentRoot = 'AppComponent';
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  logOut(): void {
    this._authService.logOut();
  }
}
