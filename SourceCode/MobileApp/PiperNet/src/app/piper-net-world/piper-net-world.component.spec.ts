import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiperNetWorldComponent } from './piper-net-world.component';

describe('PiperNetWorldComponent', () => {
  let component: PiperNetWorldComponent;
  let fixture: ComponentFixture<PiperNetWorldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiperNetWorldComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiperNetWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
