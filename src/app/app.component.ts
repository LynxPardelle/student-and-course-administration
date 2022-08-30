import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';

import { UserService } from 'src/app/user/services/user.service';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public identity: any = null;

  public title = 'Student and Course Administration';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _befService: BefService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    // this.identity = this._userService.getIdentity();
    this._userService.getIdentity(true).subscribe({
      next: (user: any) => (this.identity = user),
      error: (err: any) => console.error(err),
    });
    this._befService.cssCreate();
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  logOut(): void {
    this._userService.logOut();
  }
}
