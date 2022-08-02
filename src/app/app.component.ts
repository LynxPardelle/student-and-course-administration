import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';

/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public identity: any = null;

  title = 'Student and Course Administration';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _befService: BefService
  ) {}

  ngOnInit(): void {
    this.getIdentity();
    this._befService.cssCreate();
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }

  logOut(): void {
    localStorage.removeItem('identitySACA');
  }

  getIdentity() {
    let identity = localStorage.getItem('identitySACA');
    if (identity !== null) {
      identity = JSON.parse(identity);
      this.identity = identity;
      this._router.navigate(['/login']);
    }
  }
}
