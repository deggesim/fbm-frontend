import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { History } from '@app/models/history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(fantasyTeamId: string) {
    return this.http.get<History[]>(`${this.endpoint}/history/fantasy-team/${fantasyTeamId}`);
  }
}
