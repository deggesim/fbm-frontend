import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RealFixture } from '@app/models/real-fixture';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RealFixtureService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(prepared?: boolean) {
    let endpoint = `${this.endpoint}/real-fixtures`;
    if (prepared) {
      endpoint += '?prepared=true';
    }
    return this.http.get<RealFixture[]>(endpoint);
  }

  public getByFixture(fixtureId: string) {
    return this.http.get<RealFixture>(`${this.endpoint}/real-fixtures/fixture/${fixtureId}`);
  }

  public create(realFixture: RealFixture) {
    return this.http.post<RealFixture>(`${this.endpoint}/real-fixtures`, realFixture);
  }

  public update(realFixture: RealFixture) {
    return this.http.patch<RealFixture>(`${this.endpoint}/real-fixtures/${realFixture._id}`, realFixture);
  }

  public delete(id: string) {
    return this.http.delete<RealFixture>(`${this.endpoint}/real-fixtures/${id}`);
  }
}
