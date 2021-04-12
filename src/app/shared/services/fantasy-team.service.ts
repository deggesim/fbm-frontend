import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FantasyTeam } from '@app/models/fantasy-team';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FantasyTeamService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<FantasyTeam[]>(`${this.endpoint}/fantasy-teams`);
  }

  public get(id: string) {
    return this.http.get<FantasyTeam>(`${this.endpoint}/fantasy-teams/${id}`);
  }

  public create(fantasyTeams: FantasyTeam[], leagueId: string) {
    return this.http.post<FantasyTeam[]>(`${this.endpoint}/fantasy-teams/league/${leagueId}`, fantasyTeams);
  }

  public update(fantasyTeam: FantasyTeam) {
    return this.http.patch<FantasyTeam[]>(`${this.endpoint}/fantasy-teams/${fantasyTeam._id}`, fantasyTeam);
  }

  public delete(id: string) {
    return this.http.delete<FantasyTeam[]>(`${this.endpoint}/fantasy-teams/${id}`);
  }
}
