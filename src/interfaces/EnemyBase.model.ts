import { Building } from "./Building.model";

export interface EnemyBase {
  id: string;
  buildings: Building[];
}

export const enemyBases: EnemyBase[] = [];
