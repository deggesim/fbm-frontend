import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/models/player';
import { PopupConfermaComponent } from 'src/app/shared/popup-conferma/popup-conferma.component';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { PlayerService } from 'src/app/services/player.service';
import { tap, switchMap } from 'rxjs/operators';
import * as globals from '../../../shared/globals';

@Component({
  selector: 'app-player-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  players: Player[];

  playerSelected: Player;
  mostraPopupModifica: boolean;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfermaComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfermaComponent;

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
      }
    );
  }

  nuova() {
    this.playerSelected = undefined;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Nuova squadra';
  }

  modifica(player: Player): void {
    // tslint:disable-next-line: variable-name
    const { _id, name, nationality, number, yearBirth, height, weight, role } = player;
    this.playerSelected = { _id, name, nationality, number, yearBirth, height, weight, role };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Modifica squadra';
  }

  clona(player: Player): void {
    // tslint:disable-next-line: variable-name
    const { name, nationality, number, yearBirth, height, weight, role } = player;
    this.playerSelected = { name, nationality, number, yearBirth, height, weight, role };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Clona squadra';
  }

  async salva(player: Player) {
    try {
      if (player._id == null) {
        this.playerService.create(player).subscribe(() => {
          this.mostraPopupModifica = false;
          const title = 'Nuova squadra';
          const message = 'Nuova squadra inserita correttamente';
          this.sharedService.notifica(globals.toastType.success, title, message);
        });
      } else {
        this.playerService.update(player).subscribe(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica squadra';
          const message = 'Squadra modificata correttamente';
          this.sharedService.notifica(globals.toastType.success, title, message);
        });
      }
      this.playerSelected = undefined;
      this.playerService.read().subscribe((players: Player[]) => {
        this.players = players;
      });
    } catch (error) {
      console.error(error);
    }
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
            const title = 'Squadra eliminata';
            const message = 'La squadra è stata eliminata correttamente';
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
