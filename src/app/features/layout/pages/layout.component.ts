import {
  Component,
  DoCheck,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { LayoutService } from '../services/layout.service';
import { LayoutTopbarComponent } from '../layout-topbar/layout-topbar.component';
import { LayoutItemsComponent } from '../layout-items/layout-items.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  // 因 LayoutComponent 為 standalone ，所以需引入 RouterModule，否則 html 內的 <router-outlet></router-outlet> 會報錯
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    LayoutTopbarComponent,
    LayoutItemsComponent,
  ],
  providers: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  sidebarVisible: boolean = true; // 預設開啟

  username!: string | null;

  permissions: string[] = []; // 根據權限決定左側邊框能看到什麼頁面

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {}

  /**
   * 更新 Sidebar 的顯示狀態
   * */
  onChangeSidebarVisible(visible: boolean) {
    this.sidebarVisible = visible;
  }
}
