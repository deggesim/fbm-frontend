import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Roster, RosterList } from '@app/models/roster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RosterService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read(page: number, limit: number, filter?: string): Observable<RosterList> {
    const endpoint =
      filter == null
        ? `${this.endpoint}/rosters?page=${page}&limit=${limit}`
        : `${this.endpoint}/rosters?page=${page}&limit=${limit}&filter=${filter}`;
    return this.http
      .get<Roster[]>(endpoint, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Roster[]>) => {
          const rosterList: RosterList = {
            totalElements: +response.headers.get('X-Total-Count'),
            content: response.body,
          };
          return rosterList;
        })
      );
  }

  public freePlayers(page: number, limit: number, filter?: string): Observable<RosterList> {
    const endpoint =
      filter == null
        ? `${this.endpoint}/rosters/free?page=${page}&limit=${limit}`
        : `${this.endpoint}/rosters/free?page=${page}&limit=${limit}&filter=${filter}`;
    return this.http
      .get<Roster[]>(endpoint, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Roster[]>) => {
          const rosterList: RosterList = {
            totalElements: +response.headers.get('X-Total-Count'),
            content: response.body,
          };
          return rosterList;
        })
      );
  }

  public create(roster: Roster) {
    return this.http.post<Roster>(`${this.endpoint}/rosters`, roster);
  }

  public update(roster: Roster) {
    return this.http.patch<Roster>(`${this.endpoint}/rosters/${roster._id}`, roster);
  }

  public delete(id: string) {
    return this.http.delete<Roster>(`${this.endpoint}/rosters/${id}`);
  }
}
