import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CoreModule } from '../../core.module';
import { SharedModule } from '../../../shared/shared.module';
import { Subject } from 'rxjs/internal/Subject';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [SharedModule, CoreModule],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss',
  providers: [],
})
export class RedirectComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.redirect();
  }

  /**
   * 重導向
   */
  redirect() {}

  /**
   * 刷新 Token
   */
  refreshToken() {}
}
