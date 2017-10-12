import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KvmarktUserComponent } from './kvmarkt-user.component';

describe('KvmarktUserComponent', () => {
  let component: KvmarktUserComponent;
  let fixture: ComponentFixture<KvmarktUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KvmarktUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvmarktUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
