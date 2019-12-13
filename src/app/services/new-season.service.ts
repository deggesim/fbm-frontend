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

  public createLeague(league: League) {
    return this.http.post<League>(`${this.endpoint}/leagues`, league);
  }

  public insertFantasyTeams(leagueId: string, fantasyTeams: FantasyTeam[]) {
    return this.http.post<League>(`${this.endpoint}/leagues/${leagueId}/fantasy-teams`, fantasyTeams);
  }

}
