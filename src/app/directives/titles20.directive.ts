import { Directive, ElementRef, OnInit } from '@angular/core';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Directive({
  selector: '[appTitles20]',
})
export class Titles20Directive implements OnInit {
  constructor(private element: ElementRef, private _befService: BefService) {}

  ngOnInit(): void {
    this.element.nativeElement.classList.add('bef');
    this.element.nativeElement.classList.add('bef-fs-20px');
    this._befService.cssCreate();
  }
}
