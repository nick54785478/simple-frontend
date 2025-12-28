import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FishboneNode } from '../../../models/fishbone-node.model';
import { SharedModule } from '../../../../../shared/shared.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxFishboneDiagramModule } from 'ngx-fishbone-diagram';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TreeNode } from '../../../../../shared/models/tree-node.model';

@Component({
  selector: 'app-fishbone-diagram',
  standalone: true,
  imports: [CommonModule, SharedModule, NgxFishboneDiagramModule],
  templateUrl: './fishbone-diagram.component.html',
  styleUrl: './fishbone-diagram.component.scss',
})
export class FishboneDiagramComponent implements OnInit {
  data!: any;
  isBrowser!: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private dialogConfig: DynamicDialogConfig
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    let cols = this.dialogConfig.data['cols'];
    let treeNodes = this.dialogConfig.data['data'];
    console.log(cols);
    console.log(treeNodes);

    this.data = this.convertToFishboneWithUUID(treeNodes);
    console.log(this.data);

    // this.data = {
    //   name: '客戶測試階段發現異常電流問題',
    //   uuid: 'root-1',
    //   children: [
    //     {
    //       name: '人 (Man)',
    //       uuid: 'man-1',
    //       children: [
    //         { name: '操作員未按標準程序操作', uuid: 'man-11' },
    //         { name: '操作員培訓不足', uuid: 'man-12' },
    //         { name: '誤讀測試設備指示燈', uuid: 'man-13' },
    //       ],
    //     },
    //     {
    //       name: '機 (Machine)',
    //       uuid: 'machine-1',
    //       children: [
    //         { name: '測試設備校正不準', uuid: 'machine-11' },
    //         { name: '老化的電源供應器', uuid: 'machine-12' },
    //         { name: 'PCB 測試夾具接觸不良', uuid: 'machine-13' },
    //       ],
    //     },
    //     {
    //       name: '料 (Material)',
    //       uuid: 'material-1',
    //       children: [
    //         { name: '電阻規格異常', uuid: 'material-11' },
    //         { name: '供應商提供電源模組品質不穩定', uuid: 'material-12' },
    //         { name: '焊錫材料受潮', uuid: 'material-13' },
    //       ],
    //     },
    //     {
    //       name: '法 (Method)',
    //       uuid: 'method-1',
    //       children: [
    //         { name: '測試 SOP 未更新', uuid: 'method-11' },
    //         { name: '測試步驟順序錯誤', uuid: 'method-12' },
    //         { name: '未使用測試治具固定元件', uuid: 'method-13' },
    //       ],
    //     },
    //     {
    //       name: '環 (Environment)',
    //       uuid: 'env-1',
    //       children: [
    //         { name: '測試室溫濕度超出規範', uuid: 'env-11' },
    //         { name: '電磁干擾影響測試結果', uuid: 'env-12' },
    //         { name: '供電波動', uuid: 'env-13' },
    //       ],
    //     },
    //     {
    //       name: '測 (Measurement)',
    //       uuid: 'measure-1',
    //       children: [
    //         { name: '測試儀器量程設定不當', uuid: 'measure-11' },
    //         { name: '量測線接觸不良', uuid: 'measure-12' },
    //         { name: '測試數據紀錄錯誤', uuid: 'measure-13' },
    //       ],
    //     },
    //   ],
    // };
  }

  /**
   * 將 TreeNode 轉換成帶 UUID 的 Fishbone 結構（遞迴版本）
   */
  private convertToFishboneWithUUID(
    nodes: TreeNode[],
    rootName: string = '客戶測試階段發現異常電流問題'
  ): FishboneNode {
    const keyMap: Record<string, string> = {
      '人 (Man)': 'man',
      '機 (Machine)': 'machine',
      '料 (Material)': 'material',
      '法 (Method)': 'method',
      '環 (Environment)': 'env',
      '測 (Measurement)': 'measure',
    };

    // 遞迴處理每個節點
    const convertNode = (
      node: TreeNode,
      keyPrefix: string,
      index: number
    ): FishboneNode => {
      const key =
        keyMap[node.data.name] ||
        node.data.name.toLowerCase().replace(/\s+/g, '');
      const nodeUUID = `${keyPrefix}${index}`;
      return {
        name: node.data.name,
        uuid: nodeUUID,
        children:
          node.children?.map((child, idx) =>
            convertNode(child, nodeUUID, idx + 1)
          ) ?? [],
      };
    };

    return {
      name: rootName,
      uuid: crypto.randomUUID(),
      children: nodes.map((node, idx) => convertNode(node, '', idx + 1)),
    };
  }
}
