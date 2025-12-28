import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ContextMenu } from 'primeng/contextmenu';
import { BaseFtaCompoent } from '../../../../shared/component/base/base-fta.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Option } from '../../../../shared/models/option.model';
import { FtaService } from '../../services/fta.service';
import {
  SaveFtaDiagramResource,
  SaveFtaNode,
} from '../../models/save-fta-diagram.model';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-simple-fta',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './simple-fta.component.html',
  styleUrl: './simple-fta.component.scss',
})
export class SimpleFtaComponent extends BaseFtaCompoent implements OnInit {
  override selectedNode: TreeNode | null = null;
  eventList: Option[] = [];
  // problemUuid 此處假設與問題單綁定
  problemUuid!: string;

  constructor(private ftaService: FtaService) {
    super();
  }

  override ngOnInit(): void {
    // 取得預設 fta 資料
    this.getDefaultData();

    this.formGroup = new FormGroup({
      rootEvent: new FormControl('', [Validators.required]),
    });

    // 這邊的資料通常來自魚骨圖的分支 (挑選出最可能發生的分支)
    this.ftaService.getTopEventOptions(this.problemUuid).subscribe((res) => {
      this.eventList = res;
    });
  }

  /**
   * Dropdown 切換事件
   * @param event
   */
  onRootEventChange(event: any) {
    console.log(event.value); // 新值
    console.log(event.originalEvent); // DOM event
    this.getFtaDiagram(event.value);
  }

  /**
   * 取得 fta 圖表資料
   * @param topEvent
   */
  getFtaDiagram(topEvent?: string) {
    if (!topEvent) {
      this.getDefaultData();
    } else {
      this.ftaService
        .getFtaDiagram(this.problemUuid, topEvent)
        .subscribe((res) => {
          if (res.length !== 0) {
            this.ftaData = res;
          } else {
            this.getDefaultData();
          }
        });
    }
  }

  save() {
    this.submitted = true;
    if (!this.submitted || this.formGroup.invalid) {
      return;
    }
    this.loadingMaskService.show();
    console.log(this.formGroup.value);
    console.log(this.ftaData);
    let formData = this.formGroup.value;
    const requestData: SaveFtaDiagramResource = {
      uuid: formData?.uuid,
      title: formData.title,
      problemUuid: this.problemUuid,
      diagram: this.mapTreeNodeToDto(this.ftaData),
    };

    console.log(requestData);
    this.ftaService
      .saveFta(requestData)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.loadingMaskService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          if (res.code !== '200' && res.code !== '201') {
            this.messageService.error(res.message);
          } else {
            this.messageService.success(res.message);

            // this.ftaService
            //   .getTopEventOptions(this.problemUuid)
            //   .subscribe((res) => {
            //     this.ftaService.setTopEvents(res);
            //   });
          }
        },
        error: (error) => {
          console.log(error);
          this.messageService.error(error);
        },
      });
  }

  /**
   * 取消
   */
  cancel() {
    this.getDefaultData();
    this.formGroup.reset();
  }

  // 遞迴轉換，去掉 parent / expanded 等循環引用
  private mapTreeNodeToDto(nodes: TreeNode[]): SaveFtaNode[] {
    return nodes.map((n) => ({
      id: (n as any).id || crypto.randomUUID(), // 保證有 id
      label: n.label ?? '',
      type: (n as any).type || 'event',
      children: n.children ? this.mapTreeNodeToDto(n.children) : undefined,
    }));
  }
}
