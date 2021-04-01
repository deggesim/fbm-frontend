import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fixture } from '@app/models/fixture';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FixtureService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<Fixture[]>(`${this.endpoint}/fixtures`);
  }

  public create(fixture: Fixture) {
    return this.http.post<Fixture>(`${this.endpoint}/fixtures`, fixture);
  }

  public update(fixture: Fixture) {
    return this.http.patch<Fixture>(`${this.endpoint}/fixtures/${fixture._id}`, fixture);
  }

  public delete(id: string) {
    return this.http.delete<Fixture>(`${this.endpoint}/fixtures/${id}`);
  }
}
