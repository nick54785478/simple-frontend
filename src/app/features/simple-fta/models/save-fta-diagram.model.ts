import { TreeNode } from 'primeng/api';

export class SaveFtaDiagramResource {
  uuid?: string;
  title!: string;
  problemUuid!: string;
  diagram: TreeNode[] = [];
}

export interface SaveFtaNode {
  id: string;
  label: string;
  type: string;
  children?: SaveFtaNode[];
}
