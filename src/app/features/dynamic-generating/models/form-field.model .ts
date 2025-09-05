import { Option } from '../../../shared/models/option.model';

export interface FormField {
  name: string;
  type: string;
  label: string;
  validators: string[];
  options: Option[]; // 只有 dropdown 才有 options
  pattern: string; // 只有 calendar 才有 pattern
  placeholder: string;
  rows: string; // textArea 列
  cols: string; // textArea 行
  uri: string; // AutoComplete 對應路徑
}
