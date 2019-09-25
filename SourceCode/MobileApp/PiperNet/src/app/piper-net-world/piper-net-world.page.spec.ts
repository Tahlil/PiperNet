import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiperNetWorldPage } from './piper-net-world.page';

describe('PiperNetWorldPage', () => {
  let component: PiperNetWorldPage;
  let fixture: ComponentFixture<PiperNetWorldPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiperNetWorldPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiperNetWorldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
