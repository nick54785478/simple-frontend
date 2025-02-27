import { provideRouter, Routes } from '@angular/router';
import { AboutComponent } from './features/about/pages/about/about.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { ErrorComponent } from './features/layout/error/error.component';
import { AccessDeniedComponent } from './features/layout/access-denied/access-denied.component';
import { NotFoundComponent } from './features/layout/not-found/not-found.component';
import { LoginComponent } from './features/layout/login/login.component';
import { LayoutComponent } from './features/layout/pages/layout.component';
import { RedirectComponent } from './core/components/redirect/redirect.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // 使用 Layout 作為主版面
    children: [
      // 子頁面
      {
        path: '',
        loadChildren: () =>
          import('./features/features.module').then((m) => m.FeaturesModule),
      },
    ],
  },
  {
    path: 'redirect',
    component: RedirectComponent,
  },
  // 登入頁面
  {
    path: 'login',
    component: LoginComponent,
  },
  // 預設 '' 重導向到 /features
  { path: '', redirectTo: '/features', pathMatch: 'full' },

  // Not Found
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  // Access Denied
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },

  // Error
  {
    path: 'error',
    component: ErrorComponent,
  },
  // 通配符路由
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
