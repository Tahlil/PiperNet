import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalWorldComponent } from './local-world.component';

describe('LocalWorldComponent', () => {
  let component: LocalWorldComponent;
  let fixture: ComponentFixture<LocalWorldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalWorldComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
