import { Routes } from '@angular/router';
import { HomeComponent } from './home/pages/home/home.component';
import { ExampleComponent } from './example/pages/example/example.component';
import { AboutComponent } from './about/pages/about/about.component';
import { BaseUploadCompoent } from '../shared/component/base/base-upload.component';
import { SimpleUploadComponent } from './simple-upload/pages/simple-upload/simple-upload.component';
import { SimpleFormTableComponent } from './simple-form-table/pages/simple-form-table/simple-form-table.component';
import { SimplePicklistComponent } from './simple-picklist/pages/simple-picklist/simple-picklist.component';
import { SimpleInlineEditComponent } from './simple-inline-edit/pages/simple-inline-edit/simple-inline-edit.component';
import { SimpleHeaderLineTableComponent } from './simple-header-line-table/pages/simple-header-line-table/simple-header-line-table.component';
import { DynamicGeneratingComponent } from './dynamic-generating/pages/dynamic-generating/dynamic-generating.component';

/**
 * 定義 Features 子路由配置的檔案
 */
export const routes: Routes = [
  // 預設路徑顯示 HomeComponent
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'example',
    component: ExampleComponent,
  },
  {
    path: 'simple-form-table',
    component: SimpleFormTableComponent,
  },
  {
    path: 'simple-upload',
    component: SimpleUploadComponent,
  },
  {
    path: 'simple-picklist',
    component: SimplePicklistComponent,
  },
  {
    path: 'simple-inline-edit',
    component: SimpleInlineEditComponent,
  },
  {
    path: 'simple-header-line-table',
    component: SimpleHeaderLineTableComponent,
  },
  {
    path: 'dynamic-generating',
    component: DynamicGeneratingComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];
