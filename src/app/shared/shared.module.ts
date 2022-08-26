import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

/* Modules */
import { NgxBootstrapModule } from 'src/app/shared/ngx-bootstrap.module';
import { MaterialModule } from 'src/app/shared/material.module';

/* Directives */
import { NgInitDirective } from 'src/app/shared/directives/ng-init.directive';
import { Titles20Directive } from 'src/app/shared/directives/titles20.directive';

/* Pipes */
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html';
import { NameParserPipe } from 'src/app/shared/pipes/name-parser.pipe';
@NgModule({
  declarations: [
    /* Directives */
    NgInitDirective,
    Titles20Directive,

    /* Pipes */
    SafeHtmlPipe,
    NameParserPipe,
  ],
  imports: [CommonModule, BrowserModule, NgxBootstrapModule, MaterialModule],
  exports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
    MaterialModule,
    NgInitDirective,
    Titles20Directive,
    SafeHtmlPipe,
    NameParserPipe,
  ],
})
export class SharedModule {}
