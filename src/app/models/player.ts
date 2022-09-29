import { FbmModel } from './fbm.model';
import { Performance } from './performance';
export interface Player extends FbmModel {
  name: string;
  nationality: string;
  number: string;
  yearBirth: number;
  height: number;
  weight: number;
  role: string;
  performances?: Performance[];
}

export enum Role {
  'Playmaker' = 'Playmaker',
  'PlayGuardia' = 'Play/Guardia',
  'Guardia' = 'Guardia',
  'GuardiaAla' = 'Guardia/Ala',
  'Ala' = 'Ala',
  'AlaCentro' = 'Ala/Centro',
  'Centro' = 'Centro',
}
