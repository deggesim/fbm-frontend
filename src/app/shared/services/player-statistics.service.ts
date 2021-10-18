import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerStatistic, PlayerStatisticList } from '@app/models/player-statistics';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerStatisticService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(page: number, limit: number): Observable<PlayerStatisticList> {
    const endpoint = `${this.endpoint}/statistics?page=${page}&limit=${limit}`;
    return this.http
      .get<PlayerStatistic[]>(endpoint, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<PlayerStatistic[]>) => {
          const playerStatistcList: PlayerStatisticList = {
            totalElements: +response.headers.get('X-Total-Count'),
            content: response.body,
          };
          return playerStatistcList;
        })
      );
  }
}
