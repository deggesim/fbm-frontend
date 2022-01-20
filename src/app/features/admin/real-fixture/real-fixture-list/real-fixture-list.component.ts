import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealFixture } from '@app/models/real-fixture';
import { RealFixtureService } from '@app/shared/services/real-fixture.service';
import { ToastService } from '@app/shared/services/toast.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-real-fixture-list',
  templateUrl: './real-fixture-list.component.html',
})
export class RealFixtureListComponent implements OnInit {
  realFixtures: RealFixture[];
  realFixtureSelected: RealFixture;
  showPopupUpdate: boolean;

  constructor(private route: ActivatedRoute, private toastService: ToastService, private realFixtureService: RealFixtureService) {}

  ngOnInit() {
    this.realFixtures = this.route.snapshot.data['realFixtures'];
  }

  update(realFixture: RealFixture): void {
    this.realFixtureSelected = realFixture;
    this.showPopupUpdate = true;
  }

  save(realFixture: RealFixture) {
    if (realFixture._id == null) {
      this.toastService.success('Giornata non trovata', 'La giornata non esiste, provare a ricaricare la pagina.');
    } else {
      this.realFixtureService
        .update(realFixture)
        .pipe(
          tap(() => {
            this.showPopupUpdate = false;
            this.toastService.success('Modifica giornata', `La giornata ${realFixture.name} è stata modificata correttamente`);
            this.realFixtureSelected = undefined;
          }),
          switchMap(() => this.realFixtureService.read())
        )
        .subscribe((realFixtures: RealFixture[]) => {
          this.realFixtures = realFixtures;
        });
    }
  }

  cancel(): void {
    this.showPopupUpdate = false;
  }
}
