import { Component, DebugElement, ElementRef } from '@angular/core';
import { Titles20Directive } from './titles20.directive';
/* Bef */
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({ template: `<h1 appTitles20>Some Title</h1>` })
class TestTitles20Component {}

describe('Titles20Directive', () => {
  let component: TestTitles20Component;
  let fixture: ComponentFixture<TestTitles20Component>;
  let title: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTitles20Component],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTitles20Component);
    component = fixture.componentInstance;
    title = fixture.debugElement.query(By.css('h1'));
    fixture.detectChanges();
  });

  it('Component TestTitles20Component exists', () => {
    expect(component).toBeTruthy();
  });

  it('should create an instance', () => {
    const directive = new Titles20Directive(
      title.nativeElement,
      new BefService()
    );
    expect(directive).toBeTruthy();
  });
});
0;
