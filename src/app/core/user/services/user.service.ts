import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { user } from '@app/core/user//store/user.selector';
import { Auth, Role, User } from '@app/models/user';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient, private store: Store<AppState>) {}

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

  public loadProfile() {
    return this.http.get<Auth>(`${this.endpoint}/users/me`);
  }

  public updateProfile(user: User) {
    return this.http.patch<User>(`${this.endpoint}/users/me`, user);
  }

  public upload(file: File) {
    const formData = new FormData();
    formData.append('users', file);
    return this.http.post<User[]>(`${this.endpoint}/users/upload`, formData);
  }

  public isAdmin$ = (): Observable<boolean> => {
    return this.store.pipe(
      select(user),
      map((user: User) => user && (Role.Admin === user.role || Role.SuperAdmin === user.role))
    );
  };

  public isSuperAdmin$ = (): Observable<boolean> => {
    return this.store.pipe(
      select(user),
      map((user: User) => user && Role.SuperAdmin === user.role)
    );
  };
}
