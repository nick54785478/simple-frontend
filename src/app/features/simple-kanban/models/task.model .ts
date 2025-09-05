export interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  responsiblePerson: string;
  remark: string;
}
