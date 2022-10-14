import { DateTime } from 'luxon';
import { League } from './league';

export interface FbmModel {
  _id?: string;
  createdAt?: string | DateTime;
  updatedAt?: string | DateTime;
  league?: League;
}
