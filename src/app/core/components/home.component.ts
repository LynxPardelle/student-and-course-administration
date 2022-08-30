import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';

import { UserService } from 'src/app/user/services/user.service';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public identity: any = null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _befService: BefService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this._userService.getIdentity(true).subscribe({
      next: (identity: any) => (this.identity = identity),
      error: (err: any) => {
        console.error(err);
        this._router.navigate(['/auth/login']);
      },
    });
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
