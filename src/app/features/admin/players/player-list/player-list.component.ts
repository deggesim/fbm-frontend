import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { LeagueInfo } from '@app/models/league';
import { Player } from '@app/models/player';
import { Roster, RosterList } from '@app/models/roster';
import { PopupConfermaComponent } from '@app/shared/components/popup-conferma/popup-conferma.component';
import { PlayerService } from '@app/shared/services/player.service';
import { RosterService } from '@app/shared/services/roster.service';
import { ToastService } from '@app/shared/services/toast.service';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { iif, Observable, of, Subject, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, switchMapTo, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
})
export class PlayerListComponent implements OnInit {
  leagueInfo: LeagueInfo;
  rosterList: RosterList;
  filter: string;
  filter$ = new Subject<string>();

  rosterSelected: Roster;
  mostraPopupModifica: boolean;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfermaComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfermaComponent;

  // paginazione
  page = 1;
  limit = 10;
  maxSize = 5;
  boundaryLinks = true;

  percentage = 0;
  progressbarType = 'warning';

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private rosterService: RosterService,
    private playerService: PlayerService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.rosterList = this.route.snapshot.data.rosterList;
    this.store.pipe(select(leagueInfo)).subscribe((li: LeagueInfo) => {
      this.leagueInfo = li;
    });

    this.filter$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(() =>
          iif(
            () => this.filter != null && this.filter !== '',
            this.filter?.length > 2 ? this.rosterService.read(this.page, this.limit, this.filter) : of(this.rosterList),
            this.rosterService.read(this.page, this.limit)
          )
        )
      )
      .subscribe((rosterList: RosterList) => {
        this.rosterList = rosterList;
      });
  }

  pulisciFiltro(): void {
    this.filter = null;
    this.filter$.next();
  }

  abilitaPaginazione() {
    return !isEmpty(this.rosterList?.content) && this.rosterList?.totalElements > this.limit;
  }

  pageChange(event) {
    this.page = event.page;
    this.rosterService.read(this.page, this.limit, this.filter).subscribe((rosterList: RosterList) => {
      this.rosterList = rosterList;
    });
  }

  nuova() {
    this.rosterSelected = undefined;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Nuovo giocatore';
  }

  modifica(roster: Roster): void {
    this.rosterSelected = roster;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Modifica giocatore';
  }

  clona(roster: Roster): void {
    // tslint:disable-next-line: variable-name
    const { name, nationality, number, yearBirth, height, weight, role } = roster.player;
    this.rosterSelected = {
      player: {
        name,
        nationality,
        number,
        yearBirth,
        height,
        weight,
        role,
      },
      team: roster.team,
      realFixture: roster.realFixture,
    };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Clona giocatore';
  }

  salva(roster: Roster) {
    let $rostersObservable: Observable<RosterList>;
    if (roster._id == null) {
      $rostersObservable = this.playerService.create(roster.player).pipe(
        tap((player: Player) => {
          roster.player = player;
        }),
        switchMapTo(this.rosterService.create(roster)),
        tap(() => {
          this.mostraPopupModifica = false;
          this.toastService.success('Nuovo giocatore', `Il giocatore ${roster.player.name} è stato inserito correttamente`);
        }),
        switchMapTo(this.filterPlayer()),
        tap(() => {
          this.rosterSelected = undefined;
        })
      );
    } else {
      $rostersObservable = this.playerService.update(roster.player).pipe(
        tap((player: Player) => {
          roster.player = player;
        }),
        switchMapTo(this.rosterService.update(roster)),
        tap(() => {
          this.mostraPopupModifica = false;
          this.toastService.success('Modifica giocatore', `Il giocatore ${roster.player.name} è stato modificato correttamente`);
        }),
        switchMapTo(this.filterPlayer()),
        tap(() => {
          this.rosterSelected = undefined;
        })
      );
    }

    $rostersObservable.subscribe((rosterList: RosterList) => {
      this.rosterList = rosterList;
    });
  }

  private filterPlayer(): Observable<RosterList> {
    return iif(
      () => this.filter != null && this.filter !== '',
      this.filter?.length > 2 ? this.rosterService.read(this.page, this.limit, this.filter) : of(this.rosterList),
      this.rosterService.read(this.page, this.limit)
    );
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

  apriPopupElimina(roster: Roster) {
    this.rosterSelected = roster;
    this.popupConfermaElimina.apriModale();
  }

  confermaElimina() {
    if (this.rosterSelected) {
      this.popupConfermaElimina.chiudiModale();
      this.rosterService
        .delete(this.rosterSelected._id)
        .pipe(
          tap(() => {
            this.toastService.success(
              'Giocatore eliminato',
              `Il giocatore ${this.rosterSelected.player.name} è stato eliminato correttamente`
            );
            this.rosterSelected = undefined;
          }),
          switchMap(() => this.rosterService.read(this.page, this.limit))
        )
        .subscribe((rosterList: RosterList) => {
          this.rosterList = rosterList;
        });
    }
  }

  apriPopupUpload() {
    this.popupUpload.apriModale();
  }

  confermaUpload(file: File) {
    this.playerService.upload(file).subscribe((size: number) => {
      this.popupUpload.chiudiModale();
      this.uploadPercentage();
    });
  }

  uploadPercentage() {
    timer(0, 1000)
      .pipe(
        switchMap(() => this.playerService.uploadPercentage()),
        tap((percentage: number) => {
          this.percentage = percentage;
          this.progressbarType = percentage >= 100 ? 'success' : 'warning';
        }),
        takeWhile((percentage: number) => percentage < 100)
      )
      .subscribe();
  }

  reloadPage() {
    this.rosterService.read(this.page, this.limit).subscribe((rosterList: RosterList) => {
      this.percentage = 0;
      this.rosterList = rosterList;
    });
  }
}
