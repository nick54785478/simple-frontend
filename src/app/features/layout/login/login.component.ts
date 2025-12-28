import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { BaseFormCompoent } from '../../../shared/component/base/base-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, CoreModule],
  providers: [Router],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent
  extends BaseFormCompoent
  implements OnInit, OnDestroy
{
  private readonly _destroying$ = new Subject<void>();

  constructor(public router: Router) {
    super();
  }

  override ngOnInit(): void {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * 使用者登入
   * @returns
   */
  login() {}

  override ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  /**
   * 設置使用者名稱進 LocalStorage 和 SessionStorage
   * @param username
   */
  setUsername(username: string) {}

  /**
   * 設置 Token 進 LocalStorage 和 SessionStorage
   * @param token
   */
  setJwToken(token: string) {}
}
