import { Base } from "./Base.model";

export interface Player {
  id: string;
  name:string;
  resources: number;
  base: Base
}

