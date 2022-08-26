import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* NGX-Bootstrap */
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/* NGX-Bootstrap-Expanded-Features */
import { NgxBootstrapExpandedFeaturesService } from 'ngx-bootstrap-expanded-features';

@NgModule({
  declarations: [],
  imports: [CommonModule, ModalModule.forRoot(), BsDropdownModule.forRoot()],
  providers: [NgxBootstrapExpandedFeaturesService],
  exports: [ModalModule, BsDropdownModule],
})
export class NgxBootstrapModule {}
