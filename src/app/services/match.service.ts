import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Match } from '../models/match';

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

  public update(match: Match) {
    return this.http.patch<Match>(`${this.endpoint}/matches/${match._id}`, match);
  }

  public updateFixture(matches: Match[]) {
    return this.http.patch<Match>(`${this.endpoint}/matches/multiple`, matches);
  }

  public delete(id: string) {
    return this.http.delete<Match>(`${this.endpoint}/matches/${id}`);
  }
}
