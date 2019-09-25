import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalWorldPage } from './local-world.page';

describe('LocalWorldPage', () => {
  let component: LocalWorldPage;
  let fixture: ComponentFixture<LocalWorldPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalWorldPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalWorldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
