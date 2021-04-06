import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealFixture } from '@app/models/real-fixture';
import { RealFixtureService } from '@app/shared/services/real-fixture.service';
import { ToastService } from '@app/shared/services/toast.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-real-fixture-list',
  templateUrl: './real-fixture-list.component.html',
})
export class RealFixtureListComponent implements OnInit {
  realFixtures: RealFixture[];
  realFixtureSelected: RealFixture;
  mostraPopupModifica: boolean;

  constructor(private route: ActivatedRoute, private toastService: ToastService, private realFixtureService: RealFixtureService) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.realFixtures = data.realFixtures;
    });
  }

  modifica(realFixture: RealFixture): void {
    this.realFixtureSelected = realFixture;
    this.mostraPopupModifica = true;
  }

  salva(realFixture: RealFixture) {
    if (realFixture._id == null) {
      const title = 'Giornata non trovata';
      const message = 'La giornata non esiste, provare a ricaricare la pagina.';
      this.toastService.success(title, message);
    } else {
      this.realFixtureService
        .update(realFixture)
        .pipe(
          tap(() => {
            this.mostraPopupModifica = false;
            const title = 'Modifica giornata';
            const message = 'Giornata modificata correttamente';
            this.toastService.success(title, message);
            this.realFixtureSelected = undefined;
          }),
          switchMap(() => this.realFixtureService.read())
        )
        .subscribe((realFixtures: RealFixture[]) => {
          this.realFixtures = realFixtures;
        });
    }
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }
}
