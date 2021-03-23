import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopupConfermaComponent } from '@app/shared/components/popup-conferma/popup-conferma.component';
import { toastType } from '@app/shared/constants/globals';
import { Status } from '@app/shared/models/league';
import { Player } from '@app/shared/models/player';
import { Roster, RosterList } from '@app/shared/models/roster';
import { LeagueService } from '@app/shared/services/league.service';
import { PlayerService } from '@app/shared/services/player.service';
import { RosterService } from '@app/shared/services/roster.service';
import { SharedService } from '@app/shared/services/shared.service';
import { isEmpty } from '@app/shared/util/is-empty';
import { selectLeagueInfo, selectLeagueStatus } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { iif, Observable, of, Subject, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-player-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  leagueInfo: string;
  leagueStatus: Status;
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
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private rosterService: RosterService,
    private playerService: PlayerService,
    private store: Store
  ) {
    this.store.pipe(select(selectLeagueInfo)).subscribe((leagueInfo: string) => {
      this.leagueInfo = leagueInfo;
    });

    this.store.pipe(select(selectLeagueStatus)).subscribe((leagueStatus: Status) => {
      this.leagueStatus = leagueStatus;
    });
  }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe((data) => {
      this.rosterList = data.rosterList;
    });

    this.filter$
      .pipe(
        debounceTime(750),
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

  public isPreseason() {
    return this.leagueStatus != null && this.leagueStatus === Status.Preseason;
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
        switchMap(() => this.rosterService.create(roster)),
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Nuovo giocatore';
          const message = 'Nuovo giocatore inserito correttamente';
          this.sharedService.notifica(toastType.success, title, message);
        }),
        switchMap(() =>
          iif(
            () => this.filter != null && this.filter !== '',
            this.filter?.length > 2 ? this.rosterService.read(this.page, this.limit, this.filter) : of(this.rosterList),
            this.rosterService.read(this.page, this.limit)
          )
        ),
        tap(() => {
          this.rosterSelected = undefined;
        })
      );
    } else {
      $rostersObservable = this.playerService.update(roster.player).pipe(
        tap((player: Player) => {
          roster.player = player;
        }),
        switchMap(() => this.rosterService.update(roster)),
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica giocatore';
          const message = 'Giocatore modificato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
        }),
        switchMap(() =>
          iif(
            () => this.filter != null && this.filter !== '',
            this.filter?.length > 2 ? this.rosterService.read(this.page, this.limit, this.filter) : of(this.rosterList),
            this.rosterService.read(this.page, this.limit)
          )
        ),
        tap(() => {
          this.rosterSelected = undefined;
        })
      );
    }

    $rostersObservable.subscribe((rosterList: RosterList) => {
      this.rosterList = rosterList;
    });
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
      this.rosterService
        .delete(this.rosterSelected._id)
        .pipe(
          tap(() => {
            this.popupConfermaElimina.chiudiModale();
            const title = 'Giocatore eliminata';
            const message = 'Il giocatore è stato eliminato correttamente';
            this.sharedService.notifica(toastType.success, title, message);
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
