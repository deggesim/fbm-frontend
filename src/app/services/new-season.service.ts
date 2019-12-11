import { Injectable } from '@angular/core';
import { League } from '../models/league';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewSeasonService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public createLeague(league: League) {
    return this.http.post<League>(`${this.endpoint}/leagues`, league);
  }

}