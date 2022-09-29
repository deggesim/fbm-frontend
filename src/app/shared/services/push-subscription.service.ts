import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushSubscriptionService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  save(item: PushSubscription): Observable<PushSubscription> {
    return this.http.post<PushSubscription>(`${this.endpoint}/push-subscription`, item);
  }
}
