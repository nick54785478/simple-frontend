export class SaveFishboneDiagramResource {
  problemUuid!: string;
  diagram: SaveFishboneNode[] = [];
}
export class SaveFishboneNode {
  data!: SaveFishbonTitle;
  children: SaveFishboneNode[] = [];
}

export class SaveFishbonTitle {
  name!: string;
}
