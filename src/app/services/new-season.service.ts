import { Injectable } from '@angular/core';
import { League } from '../models/league';

@Injectable({
  providedIn: 'root'
})
export class NewSeasonService {

  constructor() { }

  public newSeason(league: League) {
    console.log('newSeason');
  }
}
