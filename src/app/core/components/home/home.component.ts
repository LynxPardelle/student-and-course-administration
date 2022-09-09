import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* RxJs */
import { Observable } from 'rxjs';

/* Models */
import { User } from 'src/app/user/models/user';

/* Services */
import { UserService } from 'src/app/user/services/user.service';

/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { IdentitySesionSelector } from 'src/app/state/selectors/sesion.selector';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { LoadSesion } from 'src/app/state/actions/sesion.actions';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public identity$: Observable<User | undefined>;

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _route: ActivatedRoute,
    private _befService: BefService,
    private _userService: UserService
  ) {
    this.identity$ = this.store.select(IdentitySesionSelector);
  }

  ngOnInit(): void {
    this.identity$.subscribe({
      next: (i) => {
        if (!this._userService.checkIfUserInterface(i)) {
          this._router.navigate(['/auth/login']);
        }
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
