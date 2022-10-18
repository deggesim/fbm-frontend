import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  private updateAvailable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  updateAvaliable$: Observable<boolean> = this.updateAvailable.asObservable();

  constructor(private readonly updates: SwUpdate) {
    this.updates.versionUpdates.subscribe((event: VersionEvent) => {
      if (event?.type === 'VERSION_READY') {
        this.updates.activateUpdate().then(() => {
          this.updateAvailable.next(true);
        });
      }
    });
  }

  doAppUpdate() {
    this.updates.activateUpdate().then((value: boolean) => {
      if (value) {
        document.location.reload();
      }
    });
  }
}
