import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FantasyTeam } from '../models/fantasy-team';

@Injectable({
  providedIn: 'root'
})
export class FantasyTeamService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public get() {
    return this.http.get<FantasyTeam[]>(`${this.endpoint}/fantasy-teams`);
  }
}
