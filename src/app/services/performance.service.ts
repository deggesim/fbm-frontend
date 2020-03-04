import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Performance } from '../models/performance';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read() {
    return this.http.get<Performance[]>(`${this.endpoint}/performances`);
  }

  public getByRealFixture(teamId: string, realFixtureId: string) {
    return this.http.get<Performance[]>(`${this.endpoint}/performances/team/${teamId}/real-fixture/${realFixtureId}`);
  }

  public create(performance: Performance) {
    return this.http.post<Performance>(`${this.endpoint}/performances`, performance);
  }

  public update(performance: Performance) {
    return this.http.patch<Performance>(`${this.endpoint}/performances/${performance._id}`, performance);
  }

  public delete(id: string) {
    return this.http.delete<Performance>(`${this.endpoint}/performances/${id}`);
  }
}
