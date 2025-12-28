import { Option } from '../../../shared/models/option.model';

export class FtaTopEventOptionQueriedResource {
  code!: string;
  message!: string;
  data: Option[] = [];
}
