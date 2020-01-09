import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { League } from '../models/league';

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

  public populate(league: League) {
    return this.http.post<League>(`${this.endpoint}/leagues/${league._id}/populate`, null);
  }

  public setParameters(leagueId: string, parameters: Array<{ parameter: string, value: string }>) {
    return this.http.post<League>(`${this.endpoint}/leagues/${leagueId}/parameters`, parameters);
  }

  public setRoles(leagueId: string, roles: Array<{ role: string, spots: number[] }>) {
    return this.http.post<League>(`${this.endpoint}/leagues/${leagueId}/roles`, roles);
  }

}
