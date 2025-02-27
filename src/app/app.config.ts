import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    // importProvidersFrom([BrowserAnimationsModule]) 需透過此注入，PrimeNG 才會有效果
    // 允許在應用中使用 Angular 動畫。這是處理動畫功能所必須的模組，通常在應用啟動時需要進行導入。
    importProvidersFrom([
      BrowserAnimationsModule,
      CoreModule,
      SharedModule,
      MessageModule,
    ]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()), // 注入 provideHttpClient 以供應用層使用 HttpClient
  ],
};
