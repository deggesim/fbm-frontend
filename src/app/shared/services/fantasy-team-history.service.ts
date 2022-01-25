import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamHistory } from '@app/models/fantasy-team-history';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FantasyTeamHistoryService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(fantasyTeamId: string) {
    return this.http.get<FantasyTeamHistory[]>(`${this.endpoint}/fantasy-teams-history/fantasy-team/${fantasyTeamId}`);
  }

  public create(fantasyTeam: FantasyTeam) {
    return this.http.post<FantasyTeam>(`${this.endpoint}/fantasy-teams`, fantasyTeam);
  }
}
