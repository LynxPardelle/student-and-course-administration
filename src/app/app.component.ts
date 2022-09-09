import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

/* RxJs */
import { Observable } from 'rxjs';

/* Models */
import { User } from './user/models/user';

/* Services */
import { UserService } from 'src/app/user/services/user.service';

/* Store */
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { IdentitySesionSelector } from './state/selectors/sesion.selector';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { CloseSesion, LoadSesion } from './state/actions/sesion.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public identity$: Observable<User | undefined>;
  public access: string = 'public';
  public ComponentRoot: string = 'AppComponent';

  public title = 'Student and Course Administration';
  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _location: Location,
    private _befService: BefService,
    private _userService: UserService
  ) {
    this.identity$ = this.store.select(IdentitySesionSelector);
  }

  ngOnInit(): void {
    this.store.dispatch(LoadSesion());
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
    this.cssCreate();
  }

  onActivate(event: any) {
    if (event._route?.component?.name) {
      this.ComponentRoot = event._route.component.name;
    } else {
      this.ComponentRoot = 'AppComponent';
    }
  }

  onDeactivate(event: any) {
    this.ComponentRoot = 'AppComponent';
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  logOut(): void {
    this.store.dispatch(CloseSesion());
    this._router.navigate(['/auth/login']);
  }
}
