import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ContextMenu } from 'primeng/contextmenu';
import { BaseFtaCompoent } from '../../../../shared/component/base/base-fta.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-simple-fta',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './simple-fta.component.html',
  styleUrl: './simple-fta.component.scss',
})
export class SimpleFtaComponent extends BaseFtaCompoent implements OnInit {
  override selectedNode: TreeNode | null = null;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }
}
