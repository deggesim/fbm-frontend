import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lineup } from '@app/models/lineup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LineupService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<Lineup[]>(`${this.endpoint}/lineups`);
  }

  public lineupByTeam(fantasyTeamId: string, fixtureId: string) {
    return this.http.get<Lineup[]>(`${this.endpoint}/lineups/fantasy-team/${fantasyTeamId}/fixture/${fixtureId}`);
  }

  public save(fantasyTeamId: string, fixtureId: string, lineup: Lineup[]) {
    return this.http.post<Lineup>(`${this.endpoint}/lineups/fantasy-team/${fantasyTeamId}/fixture/${fixtureId}`, lineup);
  }

  public update(lineup: Lineup) {
    return this.http.patch<Lineup>(`${this.endpoint}/lineups/${lineup._id}`, lineup);
  }

  public delete(fantasyTeamId: string, fixtureId: string) {
    return this.http.delete<Lineup>(`${this.endpoint}/lineups/fantasy-team/${fantasyTeamId}/fixture/${fixtureId}`);
  }
}
