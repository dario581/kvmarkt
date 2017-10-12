import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

localStorage.setItem('backand_url', 'https://api.backand.com');
localStorage.setItem('backand_app_name', 'cvjs');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
