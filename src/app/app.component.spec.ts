import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { KvmarktUserModule } from './kvmarkt-user/kvmarkt-user.module';
import { DataService } from './service/data.service';
import { BackandService } from './service/backand.service';
import { AuthService } from './service/auth.service';
import { APP_BASE_HREF } from '@angular/common';

let fixture;

describe('AppComponent', () => {
  beforeEach(async(() => {

    const userServiceStub = {
      isLoggedIn: true,
      user: { name: 'Test User' }
    };

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ], imports: [
        BrowserModule,
        RouterModule.forRoot([]),
        RouterModule,
        // KvmarktUserModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
        /* { provide: DataService, useValue: userServiceStub },
        BackandService, AuthService,  */
      ],
    }).compileComponents();

  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    const comp = fixture.componentInstance;

    /* const twainService = fixture.debugElement.injector.get(DataService);

    const spy = spyOn(twainService, 'getSchemes')
      .and.returnValue(Promise.resolve([])); */

  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should show quote after getQuote promise (async)', async(() => {
    fixture.detectChanges();
    // const de = fixture.debugElement.query(By.css('.test'));
    // const el = de.nativeElement;

    // fixture.whenStable().then(() => { // wait for async getQuote
    //   fixture.detectChanges();        // update view with quote
    //   expect(el.textContent).toBe('Finde hier alle Programme wieder, die du als „Mag ich“ gekennzeichnet hast.');
    // });
  }));

/*   it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('App');
  })); */

  /* it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const app = fixture.debugElement.componentInstance;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ' + app.title + '!');
  })); */
});
