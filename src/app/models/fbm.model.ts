import * as moment from 'moment';
import { League } from './league';

export interface FbmModel {
  _id?: string;
  createdAt?: string | moment.Moment;
  updatedAt?: string | moment.Moment;
  league?: League;
}
