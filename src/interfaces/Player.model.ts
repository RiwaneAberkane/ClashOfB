import { Base } from "./Base.model";

export interface Player {
  id: string;
  name:string;
  ressources: number;
  base: Base
}

