import { Injectable } from '@angular/core';
import { League } from '../models/league';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FantasyTeam } from '../models/fantasy-team';

@Injectable({
  providedIn: 'root'
})
export class NewSeasonService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public create(league: League) {
    return this.http.post<League>(`${this.endpoint}/leagues`, league);
  }

  public read(leagueId: string) {
    return this.http.get<League>(`${this.endpoint}/leagues/${leagueId}`);
  }

  public update(league: League) {
    return this.http.patch<League>(`${this.endpoint}/leagues/${league._id}`, league);
  }

}
