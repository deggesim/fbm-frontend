import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FantasyRoster } from '../models/fantasy-roster';

@Injectable({
  providedIn: 'root'
})
export class FantasyRosterService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read() {
    return this.http.get<FantasyRoster[]>(`${this.endpoint}/fantasy-rosters`);
  }

  public create(fantasyRoster: FantasyRoster) {
    return this.http.post<FantasyRoster>(`${this.endpoint}/fantasy-rosters`, fantasyRoster);
  }

  public update(fantasyRoster: FantasyRoster) {
    return this.http.patch<FantasyRoster>(`${this.endpoint}/fantasy-rosters/${fantasyRoster._id}`, fantasyRoster);
  }

  public delete(id: string) {
    return this.http.delete<FantasyRoster>(`${this.endpoint}/fantasy-rosters/${id}`);
  }
}
