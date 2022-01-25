import { FbmModel } from './fbm.model';

export interface Team extends FbmModel {
  fullName: string;
  sponsor?: string;
  name?: string;
  city?: string;
  abbreviation?: string;
  real: boolean;
}
