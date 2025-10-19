import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Question } from '../../models/simple-qa-request-data.model ';

@Component({
  selector: 'app-simple-qa',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './simple-qa.component.html',
  styleUrl: './simple-qa.component.scss',
})
export class SimpleQaComponent implements OnInit {
  submitted = false;

  questions: Question[] = []; // 問題

  constructor() {}
  ngOnInit(): void {
    this.questions = [
      {
        id: 1,
        title: '問題 1：目前問題狀況',
        text: '請簡述目前問題的發生狀況與背景。',
      },
      {
        id: 2,
        title: '問題 2：可能的根因',
        text: '請說明你認為造成此問題的可能原因。',
      },
      {
        id: 3,
        title: '問題 3：已採取的暫時對策',
        text: '目前是否有採取任何暫時性措施？請描述。',
      },
    ];
  }

  /** 送出回答 */
  submit() {
    this.submitted = true;

    if (!this.isFormValid()) {
      alert('⚠️ 請填寫所有必填題目再送出！');
      return;
    }

    console.log('✅ 回答結果：', this.questions);
    alert('✅ 已送出答案，請查看 console！');
  }

  /** 檢查所有題目都有回答 */
  isFormValid(): boolean {
    return this.questions.every((q) => !!q.answer?.trim());
  }

  /** 清空所有回答 */
  clearAll() {
    this.questions.forEach((q) => (q.answer = ''));
    this.submitted = false;
  }
}
