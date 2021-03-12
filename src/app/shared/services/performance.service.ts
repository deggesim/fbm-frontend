import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Performance } from '@app/shared/models/performance';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<Performance[]>(`${this.endpoint}/performances`);
  }

  public getByRealFixture(teamId: string, realFixtureId: string, filter?: number) {
    if (filter != null) {
      const params = new HttpParams().set('filter', String(filter));
      return this.http.get<Performance[]>(`${this.endpoint}/performances/team/${teamId}/real-fixture/${realFixtureId}`, { params });
    } else {
      return this.http.get<Performance[]>(`${this.endpoint}/performances/team/${teamId}/real-fixture/${realFixtureId}`);
    }
  }

  public getPerformances(playerId: string) {
    return this.http.get<Performance[]>(`${this.endpoint}/performances/player/${playerId}`);
  }

  public save(performances: Performance[]) {
    return this.http.post<Performance>(`${this.endpoint}/performances`, performances);
  }

  public boxScore(teamId: string, realFixtureId: string, url: string) {
    return this.http.post<Performance[]>(`${this.endpoint}/performances/team/${teamId}/real-fixture/${realFixtureId}`, { url });
  }

  public update(performance: Performance) {
    return this.http.patch<Performance>(`${this.endpoint}/performances/${performance._id}`, performance);
  }

  public delete(id: string) {
    return this.http.delete<Performance>(`${this.endpoint}/performances/${id}`);
  }
}
