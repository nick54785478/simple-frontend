import { CommonModule } from '@angular/common';
import {
  Component,
  DoCheck,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MenuItem } from 'primeng/api';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { map } from 'rxjs/internal/operators/map';
import { LayoutService } from '../services/layout.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { WindowRefService } from '../services/window-ref.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-layout-items',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [Router],
  templateUrl: './layout-items.component.html',
  styleUrl: './layout-items.component.scss',
})
export class LayoutItemsComponent implements OnInit {
  items: MenuItem[] = [];
  activeItem: MenuItem | undefined;

  private readonly _destroying$ = new Subject<void>();
  isMobile!: boolean;

  constructor(
    private layoutService: LayoutService,
    private windowRef: WindowRefService
  ) {}

  async ngOnInit(): Promise<void> {
    // 初始化 側邊的超連結
    this.items = await firstValueFrom(
      this.layoutService.getPermissions().pipe(
        map((res) => {
          return res;
        }),
        takeUntil(this._destroying$)
      )
    );

    this.checkScreenSize();
  }

  /**
   * 監測螢幕 Size
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const win = this.windowRef.nativeWindow;
    if (win) {
      this.checkScreenSize();
    }
  }

  /**
   * 檢查螢幕 Size 自動關閉左側欄
   */
  private checkScreenSize(): void {
    const win = this.windowRef.nativeWindow;
    if (win && win.innerWidth < 768) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
}
