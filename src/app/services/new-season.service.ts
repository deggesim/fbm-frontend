import { Injectable } from '@angular/core';
import { League } from '../models/league';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewSeasonService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public newSeason(league: League) {
    console.log('league', league);
    return this.http.post<League>(`${this.endpoint}/leagues`, league).subscribe((ret: League) => {
      console.log(ret);
      return ret;
    });

  }
}
