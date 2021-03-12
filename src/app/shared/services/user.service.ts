import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/shared/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public read() {
    return this.http.get<User[]>(`${this.endpoint}/users`);
  }

  public create(user: User) {
    return this.http.post<User>(`${this.endpoint}/users`, user);
  }

  public update(user: User) {
    return this.http.patch<User>(`${this.endpoint}/users/${user._id}`, user);
  }

  public delete(id: string) {
    return this.http.delete<User>(`${this.endpoint}/users/${id}`);
  }

  public upload(file: File) {
    const formData = new FormData();
    formData.append('users', file);
    return this.http.post<User[]>(`${this.endpoint}/users/upload`, formData);
  }
}
