import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FantasyRoster, sort } from '@app/shared/models/fantasy-roster';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FantasyRosterService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read(fantasyTeamId: string, realFixtureId: string) {
    return this.http.get<FantasyRoster[]>(`${this.endpoint}/fantasy-rosters/fantasy-team/${fantasyTeamId}/real-fixture/${realFixtureId}`)
      .pipe(
        tap((fantasyRosters: FantasyRoster[]) => fantasyRosters.sort(sort))
      );
  }

  public create(fantasyRoster: FantasyRoster) {
    return this.http.post<FantasyRoster>(`${this.endpoint}/fantasy-rosters`, fantasyRoster);
  }

  public update(fantasyRoster: FantasyRoster) {
    return this.http.patch<FantasyRoster>(`${this.endpoint}/fantasy-rosters/${fantasyRoster._id}`, fantasyRoster);
  }

  public delete(id: string) {
    return this.http.delete<FantasyRoster>(`${this.endpoint}/fantasy-rosters/${id}`);
  }

  public release(id: string) {
    return this.http.delete<FantasyRoster>(`${this.endpoint}/fantasy-rosters/${id}/release`);
  }

  public remove(id: string) {
    return this.http.delete<FantasyRoster>(`${this.endpoint}/fantasy-rosters/${id}/remove`);
  }
}