import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private endpoint = environment.endpoint;

  constructor(
    private http: HttpClient
  ) { }

  public getUsers() {
    return this.http.get<User[]>(`${this.endpoint}/users`);
  }

}
