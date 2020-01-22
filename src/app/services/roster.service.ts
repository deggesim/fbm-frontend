import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Roster } from '../models/roster';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read() {
    return this.http.get<Roster[]>(`${this.endpoint}/rosters`);
  }

  public freePlayers() {
    return this.http.get<Roster[]>(`${this.endpoint}/rosters/free`);
  }

  public create(roster: Roster) {
    return this.http.post<Roster>(`${this.endpoint}/rosters`, roster);
  }

  public update(roster: Roster) {
    return this.http.patch<Roster>(`${this.endpoint}/rosters/${roster._id}`, roster);
  }

  public delete(id: string) {
    return this.http.delete<Roster>(`${this.endpoint}/rosters/${id}`);
  }
}
