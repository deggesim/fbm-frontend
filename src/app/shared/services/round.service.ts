import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Round } from '@app/models/round';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<Round[]>(`${this.endpoint}/rounds`);
  }

  public create(round: Round) {
    return this.http.post<Round>(`${this.endpoint}/rounds`, round);
  }

  public update(round: Round) {
    return this.http.patch<Round>(`${this.endpoint}/rounds/${round._id}`, round);
  }

  public delete(id: string) {
    return this.http.delete<Round>(`${this.endpoint}/rounds/${id}`);
  }

  public matches(round: Round) {
    return this.http.post<Round>(`${this.endpoint}/rounds/${round._id}/matches`, round);
  }
}
