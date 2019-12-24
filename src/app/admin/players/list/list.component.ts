import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/models/player';
import { PopupConfermaComponent } from 'src/app/shared/popup-conferma/popup-conferma.component';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { PlayerService } from 'src/app/services/player.service';
import { tap, switchMap, catchError } from 'rxjs/operators';
import * as globals from '../../../shared/globals';
import { Observable, EmptyError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-player-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  players: Player[];
  listaPaginata: Player[];
  listaFiltrata: Player[];
  filter: string;

  playerSelected: Player;
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

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe(
      (data) => {
        this.players = data.players;
        this.size = this.players.length;
        this.listaPaginata = this.buildPage();
      }
    );
  }

  applicaFiltro(filtro: string) {
    if (filtro != null && filtro.length > 2) {
      this.listaFiltrata = this.players.filter((player: Player) => {
        return player.name.toLowerCase().indexOf(filtro.toLowerCase()) >= 0;
      });
    } else {
      this.listaFiltrata = this.players;
    }
    this.size = this.listaFiltrata.length;
    this.listaPaginata = this.buildPage();
  }

  pulisciFiltro(): void {
    this.filter = null;
    this.size = this.players.length;
    this.listaPaginata = this.buildPage();
  }

  abilitaPaginazione() {
    return !globals.isEmpty(this.players) && this.players.length > this.pageSize;
  }

  pageChange(event) {
    this.page = event.page;
    this.listaPaginata = this.buildPage();
  }

  buildPage() {
    let players: Player[] = [];
    if (this.filter != null && this.filter.length > 2) {
      players = this.listaFiltrata;
    } else {
      players = this.players;
    }
    const first = this.pageSize * (this.page - 1);
    const last = first + this.pageSize;
    return players.slice(first, last);
  }

  nuova() {
    this.playerSelected = undefined;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Nuovo giocatore';
  }

  modifica(player: Player): void {
    // tslint:disable-next-line: variable-name
    const { _id, name, nationality, number, yearBirth, height, weight, role } = player;
    this.playerSelected = { _id, name, nationality, number, yearBirth, height, weight, role };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Modifica giocatore';
  }

  clona(player: Player): void {
    // tslint:disable-next-line: variable-name
    const { name, nationality, number, yearBirth, height, weight, role } = player;
    this.playerSelected = { name, nationality, number, yearBirth, height, weight, role };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Clona giocatore';
  }

  async salva(player: Player) {
    let $playersObservable: Observable<Player>;
    if (player._id == null) {
      $playersObservable = this.playerService.create(player)
        .pipe(
          catchError((err) => {
            this.sharedService.notifyError(err);
            return EMPTY;
          }),
          tap(() => {
            this.mostraPopupModifica = false;
            const title = 'Nuovo giocatore';
            const message = 'Nuovo giocatore inserito correttamente';
            this.sharedService.notifica(globals.toastType.success, title, message);
          })
        );
    } else {
      $playersObservable = this.playerService.update(player).
        pipe(
          catchError((err) => {
            this.sharedService.notifyError(err);
            return EMPTY;
          }),
          tap(() => {
            this.mostraPopupModifica = false;
            const title = 'Modifica giocatore';
            const message = 'Giocatore modificato correttamente';
            this.sharedService.notifica(globals.toastType.success, title, message);
          })
        );
    }
    $playersObservable
      .pipe(
        switchMap(() => this.playerService.read()),
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.playerSelected = undefined;
        })
      ).subscribe((players: Player[]) => {
        this.players = players;
      });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

  apriPopupElimina(player: Player) {
    this.playerSelected = player;
    this.popupConfermaElimina.apriModale();
  }

  confermaElimina() {
    try {
      if (this.playerSelected) {
        this.playerService.delete(this.playerSelected._id).pipe(
          tap(() => {
            this.popupConfermaElimina.chiudiModale();
            const title = 'Giocatore eliminata';
            const message = 'Il giocatore è stato eliminato correttamente';
            this.sharedService.notifica(globals.toastType.success, title, message);
            this.playerSelected = undefined;
          }),
          switchMap(() => this.playerService.read()),
        ).subscribe((players: Player[]) => {
          this.players = players;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  apriPopupUpload() {
    this.popupUpload.apriModale();
  }

  confermaUpload(file: File) {
    this.playerService.upload(file).pipe(
      switchMap((players: Player[]) => {
        return this.playerService.read();
      }),
    ).subscribe((players: Player[]) => {
      this.players = players;
      this.popupUpload.chiudiModale();
    });
  }

}
