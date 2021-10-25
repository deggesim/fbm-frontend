import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FantasyTeam } from '@app/models/fantasy-team';
import { Role } from '@app/models/player';
import { PlayerStatistic, PlayerStatisticList } from '@app/models/player-statistics';
import { Team } from '@app/models/team';
import { extend } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerStatisticService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(
    page: number,
    limit: number,
    team?: Team,
    fantasyTeam?: FantasyTeam,
    role?: Role,
    freePlayers?: boolean
  ): Observable<PlayerStatisticList> {
    const params = { page: String(page), limit: String(limit) };
    if (team) {
      extend(params, { team: String(team._id) });
    }
    if (fantasyTeam) {
      extend(params, { fantasyTeam: String(fantasyTeam._id) });
    }
    if (role) {
      extend(params, { role: String(role) });
    }
    if (freePlayers) {
      extend(params, { freePlayers: String(true) });
    }
    const endpoint = `${this.endpoint}/statistics`;
    return this.http
      .get<PlayerStatistic[]>(endpoint, { observe: 'response', params })
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
