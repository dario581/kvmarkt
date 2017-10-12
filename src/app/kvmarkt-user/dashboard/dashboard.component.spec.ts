import { AuthService } from '../../service/auth.service';
import { HttpModule } from '@angular/http';
import { SchemeCardComponent } from '../schemes/scheme-card/scheme-card.component';
import { By } from '@angular/platform-browser';
import { BackandService } from '../../service/backand.service';
import { DataService } from '../../service/data.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dataService: BackandService;
  let spy: any;
  let el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent, SchemeCardComponent,
        { provide: APP_BASE_HREF, useValue: '/' },
        DataService, BackandService, AuthService,
        RouterModule.forRoot([]),
        RouterModule,
        HttpModule
        // KvmarktUserModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    // TwainService actually injected into the component
    dataService = fixture.debugElement.injector.get(BackandService);

    // Setup spy on the `getQuote` method
    spy = spyOn(dataService, 'getBlogposts')
      .and.returnValue(Promise.resolve([]));

    // Get the Twain quote element by CSS selector (e.g., by class name)
    // const de = fixture.debugElement.query(By.css('blopost-title'));
    // el = de.nativeElement;
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Hallo, ');
  });

  it('should show quote after getQuote promise (async)', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(el.textContent).toBe('Test Artikel der KV Marktplatz ist eröffnet');
    });
  }));
});
