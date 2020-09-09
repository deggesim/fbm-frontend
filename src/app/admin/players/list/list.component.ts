import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from '@app/models/league';
import { Player } from '@app/models/player';
import { Roster } from '@app/models/roster';
import { LeagueService } from '@app/services/league.service';
import { PlayerService } from '@app/services/player.service';
import { RosterService } from '@app/services/roster.service';
import { isEmpty, toastType } from '@app/shared/globals';
import { PopupConfermaComponent } from '@app/shared/popup-conferma/popup-conferma.component';
import { SharedService } from '@app/shared/shared.service';
import { iif, interval, Observable, of } from 'rxjs';
import { startWith, switchMap, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-player-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  leagueInfo: string;
  leagueStatus: Status;
  rosters: Roster[];
  listaPaginata: Roster[];
  listaFiltrata: Roster[];
  filter: string;

  rosterSelected: Roster;
  mostraPopupModifica: boolean;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfermaComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfermaComponent;

  // paginazione
  size: number;
  page = 1;
  pageSize = 10;
  maxSize = 5;
  boundaryLinks = true;
  searchExecute = false;

  percentage = 0;
  progressbarType = 'warning';

  constructor(
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private rosterService: RosterService,
    private playerService: PlayerService,
  ) {
    this.leagueService.leagueInfoObservable.subscribe(
      (leagueInfo: string) => {
        this.leagueInfo = leagueInfo;
      }
    );

    this.leagueService.leagueStatusObservable.subscribe(
      (leagueStatus: Status) => {
        this.leagueStatus = leagueStatus;
      }
    );
  }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe(
      (data) => {
        this.rosters = data.rosters;
        this.size = this.rosters.length;
        this.listaPaginata = this.buildPage();
      }
    );
  }

  public isPreseason() {
    return (this.leagueStatus != null) && this.leagueStatus === Status.Preseason;
  }

  applicaFiltro(filtro: string) {
    if (filtro != null && filtro.length > 2) {
      this.listaFiltrata = this.rosters.filter((roster: Roster) => {
        return roster.player.name.toLowerCase().indexOf(filtro.toLowerCase()) >= 0;
      });
    } else {
      this.listaFiltrata = this.rosters;
    }
    this.size = this.listaFiltrata.length;
    this.listaPaginata = this.buildPage();
  }

  pulisciFiltro(): void {
    this.filter = null;
    this.size = this.rosters.length;
    this.listaPaginata = this.buildPage();
  }

  abilitaPaginazione() {
    return !isEmpty(this.rosters) && this.rosters.length > this.pageSize;
  }

  pageChange(event) {
    this.page = event.page;
    this.listaPaginata = this.buildPage();
  }

  buildPage() {
    let rosters: Roster[] = [];
    if (this.filter != null && this.filter.length > 2) {
      rosters = this.listaFiltrata;
    } else {
      rosters = this.rosters;
    }
    const first = this.pageSize * (this.page - 1);
    const last = first + this.pageSize;
    return rosters.slice(first, last);
  }

  nuova() {
    this.rosterSelected = undefined;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Nuovo giocatore';
  }

  modifica(roster: Roster): void {
    // tslint:disable-next-line: variable-name
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
        role
      },
      team: roster.team,
      realFixture: roster.realFixture,
    };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Clona giocatore';
  }

  salva(roster: Roster) {
    let $rostersObservable: Observable<Roster[]>;
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
        switchMap(() => this.rosterService.read()),
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
        switchMap(() => this.rosterService.read()),
        tap(() => {
          this.rosterSelected = undefined;
        })
      );
    }

    $rostersObservable.subscribe((rosters: Roster[]) => {
      this.rosters = rosters;
      this.size = this.rosters.length;
      this.applicaFiltro(this.filter);
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
      this.rosterService.delete(this.rosterSelected._id).pipe(
        tap(() => {
          this.popupConfermaElimina.chiudiModale();
          const title = 'Giocatore eliminata';
          const message = 'Il giocatore è stato eliminato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.rosterSelected = undefined;
        }),
        switchMap(() => this.rosterService.read()),
      ).subscribe((rosters: Roster[]) => {
        this.rosters = rosters;
        this.size = this.rosters.length;
        this.applicaFiltro(this.filter);
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
    interval(1000).pipe(
      startWith(0),
      switchMap(() => this.playerService.uploadPercentage()),
      tap((percentage: number) => {
        this.percentage = percentage;
        console.log(percentage);
        this.progressbarType = percentage >= 100 ? 'success' : 'warning';
      }),
      takeWhile((percentage: number) => percentage < 100),
    ).subscribe();
  }

  reloadPage() {
    this.rosterService.read().subscribe((rosters: Roster[]) => {
      this.percentage = 0;
      this.rosters = rosters;
      this.size = this.rosters.length;
      this.listaPaginata = this.buildPage();
    });
  }

}
