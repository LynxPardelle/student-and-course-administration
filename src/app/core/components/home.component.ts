import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';

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
    private _befService: BefService
  ) {}

  ngOnInit(): void {
    this.getIdentity();
    if (this.identity === null) {
      this._router.navigate(['/user/login']);
    }
  }

  getIdentity() {
    let identity = localStorage.getItem('identitySACA');
    if (identity !== null) {
      identity = JSON.parse(identity);
      this.identity = identity;
      console.log(this.identity);
    }
  }

  cssCreate(): void {
    this._befService.cssCreate();
  }
}
