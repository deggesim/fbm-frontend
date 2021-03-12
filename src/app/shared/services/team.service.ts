import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '@app/shared/models/team';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<Team[]>(`${this.endpoint}/teams`);
  }

  public create(team: Team) {
    return this.http.post<Team>(`${this.endpoint}/teams`, team);
  }

  public update(team: Team) {
    return this.http.patch<Team>(`${this.endpoint}/teams/${team._id}`, team);
  }

  public delete(id: string) {
    return this.http.delete<Team>(`${this.endpoint}/teams/${id}`);
  }

  public upload(file: File) {
    const formData = new FormData();
    formData.append('teams', file);
    return this.http.post<Team[]>(`${this.endpoint}/teams/upload`, formData);
  }
}
