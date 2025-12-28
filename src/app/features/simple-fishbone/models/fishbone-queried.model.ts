import { FishboneNode } from './fishbone-node.model';
export class FishboneNodeQueriedResource {
  code!: string;
  message!: string;
  data: FishboneNode[] = [];
}
