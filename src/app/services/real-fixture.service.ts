import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RealFixture } from '../models/real-fixture';

@Injectable({
  providedIn: 'root'
})
export class RealFixtureService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read() {
    return this.http.get<RealFixture[]>(`${this.endpoint}/realFixtures`);
  }

  public create(realFixture: RealFixture) {
    return this.http.post<RealFixture>(`${this.endpoint}/realFixtures`, realFixture);
  }

  public update(realFixture: RealFixture) {
    return this.http.patch<RealFixture>(`${this.endpoint}/realFixtures/${realFixture._id}`, realFixture);
  }

  public delete(id: string) {
    return this.http.delete<RealFixture>(`${this.endpoint}/realFixtures/${id}`);
  }
}
