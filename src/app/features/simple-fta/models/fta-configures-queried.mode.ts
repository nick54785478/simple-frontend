export class FtaConfiguresQueriedResource {
  code!: string;
  message!: string;
  data: FtaConfigureQueriedData[] = [];
}

export class FtaConfigureQueriedData {
  uuid!: string;
  title!: string;
  value!: string;
}
