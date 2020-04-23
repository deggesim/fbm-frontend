import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealFixture } from '@app/models/real-fixture';
import { RealFixtureService } from '@app/services/real-fixture.service';
import { toastType } from '@app/shared/globals';
import { SharedService } from '@app/shared/shared.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  realFixtures: RealFixture[];
  realFixtureSelected: RealFixture;
  mostraPopupModifica: boolean;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private realFixtureService: RealFixtureService,
  ) { }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe(
      (data) => {
        this.realFixtures = data.realFixtures;
      }
    );
  }

  modifica(realFixture: RealFixture): void {
    this.realFixtureSelected = realFixture;
    this.mostraPopupModifica = true;
  }

  salva(realFixture: RealFixture) {
    if (realFixture._id == null) {
      const title = 'Giornata non trovata';
      const message = 'La giornata non esiste, provare a ricaricare la pagina.';
      this.sharedService.notifica(toastType.success, title, message);
    } else {
      this.realFixtureService.update(realFixture).pipe(
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica giornata';
          const message = 'Giornata modificata correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.realFixtureSelected = undefined;
        }),
        switchMap(() => this.realFixtureService.read())
      ).subscribe((realFixtures: RealFixture[]) => {
        this.realFixtures = realFixtures;
      });
    }
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

}
