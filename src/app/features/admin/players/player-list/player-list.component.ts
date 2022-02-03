import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { LeagueInfo } from '@app/models/league';
import { Player } from '@app/models/player';
import { Roster, RosterList } from '@app/models/roster';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { PlayerService } from '@app/shared/services/player.service';
import { RosterService } from '@app/shared/services/roster.service';
import { ToastService } from '@app/shared/services/toast.service';
import { select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { iif, Observable, of, Subject, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMapTo, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-player-list',
  templateUrl: './player-list.component.html',
})
export class PlayerListComponent implements OnInit {
  leagueInfo: LeagueInfo;
  rosterList: RosterList;
  filter: string;
  filter$ = new Subject<string>();

  rosterSelected: Roster;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfirmComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfirmComponent;
  @ViewChild('modalPlayerForm', { static: false }) modalPlayerForm: ModalDirective;
  showModalPlayerForm: boolean;

  // paginazione
  page = 1;
  limit = 10;
  maxSize = 5;
  boundaryLinks = true;

  percentage = 0;
  progressbarType: 'success' | 'info' | 'warning' | 'danger' = 'warning';

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private rosterService: RosterService,
    private playerService: PlayerService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.rosterList = this.route.snapshot.data['rosterList'];
    this.store.pipe(select(leagueInfo)).subscribe((li: LeagueInfo) => {
      this.leagueInfo = li;
    });

    this.filter$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMapTo(
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

  clearFilter(): void {
    this.filter = null;
    this.filter$.next(null);
  }

  enablePagination() {
    return !isEmpty(this.rosterList?.content) && this.rosterList?.totalElements > this.limit;
  }

  pageChange(event: { page: number }) {
    this.page = event.page;
    this.rosterService.read(this.page, this.limit, this.filter).subscribe((rosterList: RosterList) => {
      this.rosterList = rosterList;
    });
  }

  newPlayer() {
    this.rosterSelected = undefined;
    this.showModalPlayerForm = true;
    this.titoloModale = 'Nuovo giocatore';
  }

  update(roster: Roster): void {
    this.rosterSelected = roster;
    this.showModalPlayerForm = true;
    this.titoloModale = 'Modifica giocatore';
  }

  clone(roster: Roster): void {
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
    this.showModalPlayerForm = true;
    this.titoloModale = 'Clona giocatore';
  }

  save(roster: Roster) {
    let $rostersObservable: Observable<RosterList>;
    if (roster._id == null) {
      $rostersObservable = this.playerService.create(roster.player).pipe(
        tap((player: Player) => {
          this.hideModal();
          roster.player = player;
        }),
        switchMapTo(this.rosterService.create(roster)),
        switchMapTo(this.filterPlayer()),
        tap(() => {
          this.rosterSelected = undefined;
          this.toastService.success('Nuovo giocatore', `Il giocatore ${roster.player.name} è stato inserito correttamente`);
        })
      );
    } else {
      $rostersObservable = this.playerService.update(roster.player).pipe(
        tap((player: Player) => {
          this.hideModal();
          roster.player = player;
        }),
        switchMapTo(this.rosterService.update(roster)),
        switchMapTo(this.filterPlayer()),
        tap(() => {
          this.rosterSelected = undefined;
          this.toastService.success('Modifica giocatore', `Il giocatore ${roster.player.name} è stato modificato correttamente`);
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

  hideModal(): void {
    this.modalPlayerForm?.hide();
  }

  onHidden(): void {
    this.showModalPlayerForm = false;
  }

  openDeletePopup(roster: Roster) {
    this.rosterSelected = roster;
    this.popupConfermaElimina.openModal();
  }

  confirmDelete() {
    if (this.rosterSelected) {
      this.popupConfermaElimina.closeModal();
      this.rosterService
        .delete(this.rosterSelected._id)
        .pipe(switchMapTo(this.rosterService.read(this.page, this.limit)))
        .subscribe((rosterList: RosterList) => {
          this.toastService.success(
            'Giocatore eliminato',
            `Il giocatore ${this.rosterSelected.player.name} è stato eliminato correttamente`
          );
          this.rosterSelected = undefined;
          this.rosterList = rosterList;
        });
    }
  }

  openUploadPopup() {
    this.popupUpload.openModal();
  }

  confirmUpload(file: File) {
    this.playerService.upload(file).subscribe((size: number) => {
      this.popupUpload.closeModal();
      this.uploadPercentage();
    });
  }

  uploadPercentage() {
    timer(0, 1000)
      .pipe(
        switchMapTo(this.playerService.uploadPercentage()),
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
