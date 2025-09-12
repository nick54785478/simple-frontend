import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-simple-chart',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './simple-chart.component.html',
  styleUrl: './simple-chart.component.scss',
})
export class SimpleChartComponent implements OnInit {
  data: any;
  options: any;
  chartPlugins: any[] = []; // 🔹 Chart.js 插件
  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.initChart();
  }
  // Chart.js 參數

  /**
   * 初始化圓餅圖
   */
  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.data = {
        labels: ['A', 'B', 'C'], // 圓餅圖每一片對應的名稱（圖例、提示文字）。
        // Chart.js 的核心資料結構，你可以放多個 dataset（例如多個圓餅或堆疊柱狀圖）
        datasets: [
          {
            data: [540, 325, 702], // 每片的數值，決定圓餅大小比例。
            backgroundColor: ['#00bcd4', '#ff9800', '#9e9e9e'], // Cyan, Orange, Grey
            hoverBackgroundColor: ['#26c6da', '#ffa726', '#bdbdbd'], // 滑鼠移到圓餅片上時的顏色效果
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            // 圖例設定區域，控制右側或底部的小標籤。
            labels: {
              usePointStyle: true, // 將圖例的 icon 從方塊改成「圓點」或「點狀」，比較圓餅圖風格。
              color: '#333333', // 或 textColor
            },
          },
        },
        responsive: true, // 啟用響應式功能，當父容器縮放時，圖表會自動調整大小。
        maintainAspectRatio: false, // 允許容器大小控制
      };
      this.cd.markForCheck();
    }
  }
}
