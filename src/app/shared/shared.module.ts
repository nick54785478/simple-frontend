import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './primeng/primeng.module';

/**
 * 共享模組 (Shared Module)
 * 包含可重用的元件、指令與管道，專門用於在應用的多個模組之間共享。
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    PanelModule,
    PrimengModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    PrimengModule,
    PanelModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
