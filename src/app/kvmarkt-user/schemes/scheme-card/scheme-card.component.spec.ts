import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeCardComponent } from './scheme-card.component';

describe('SchemeCardComponent', () => {
  let component: SchemeCardComponent;
  let fixture: ComponentFixture<SchemeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
