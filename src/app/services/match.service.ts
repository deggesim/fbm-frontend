import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Match } from '@app/models/match';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read() {
    return this.http.get<Match[]>(`${this.endpoint}/matches`);
  }

  public create(match: Match) {
    return this.http.post<Match>(`${this.endpoint}/matches`, match);
  }

  public compute(roundId: string, fixtureId: string, matchId: string) {
    return this.http.post<Match>(`${this.endpoint}/matches/${matchId}/round/${roundId}/fixture/${fixtureId}/compute`, null);
  }

  public update(match: Match) {
    return this.http.patch<Match>(`${this.endpoint}/matches/${match._id}`, match);
  }

  public updateFixture(matches: Match[], fixtureId: string) {
    return this.http.patch<Match>(`${this.endpoint}/matches/fixture/${fixtureId}`, matches);
  }

  public delete(id: string) {
    return this.http.delete<Match>(`${this.endpoint}/matches/${id}`);
  }
}
