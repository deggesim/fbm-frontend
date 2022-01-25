import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyRosterHistory } from '@app/models/fantasy-roster-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FantasyRosterHistoryService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(fantasyTeamId: string) {
    return this.http.get<FantasyRosterHistory[]>(`${this.endpoint}/fantasy-rosters-history/fantasy-team/${fantasyTeamId}`);
  }

  public create(fantasyRoster: FantasyRoster) {
    return this.http.post<FantasyRoster>(`${this.endpoint}/fantasy-rosters`, fantasyRoster);
  }
}
