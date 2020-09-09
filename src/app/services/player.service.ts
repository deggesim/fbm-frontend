import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player } from '@app/models/player';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public read() {
    return this.http.get<Player[]>(`${this.endpoint}/players`);
  }

  public create(player: Player) {
    return this.http.post<Player>(`${this.endpoint}/players`, player);
  }

  public update(player: Player) {
    return this.http.patch<Player>(`${this.endpoint}/players/${player._id}`, player);
  }

  public delete(id: string) {
    return this.http.delete<Player>(`${this.endpoint}/players/${id}`);
  }

  public upload(file: File) {
    const formData = new FormData();
    formData.append('players', file);
    return this.http.post<number>(`${this.endpoint}/players/upload`, formData);
  }

  public uploadPercentage() {
    return this.http.get<number>(`${this.endpoint}/players/upload-percentage`, { headers: { hideSpinner: 'true' } });
  }
}
