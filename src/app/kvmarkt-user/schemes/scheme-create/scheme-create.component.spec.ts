import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeCreateComponent } from './scheme-create.component';

describe('SchemeCreateComponent', () => {
  let component: SchemeCreateComponent;
  let fixture: ComponentFixture<SchemeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
