import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team.service';
import { PopupConfermaComponent } from 'src/app/shared/popup-conferma/popup-conferma.component';
import { SharedService } from 'src/app/shared/shared.service';
import * as globals from '../../../shared/globals';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  teams: Team[];

  teamSelected: Team;
  mostraPopupModifica: boolean;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfermaComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfermaComponent;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private teamService: TeamService,
  ) { }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe(
      (data) => {
        this.teams = data.lista;
      }
    );
  }

  nuova() {
    this.teamSelected = undefined;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Nuova squadra';
  }

  modifica(team: Team): void {
    const { _id, fullName, sponsor, name, city, abbreviation, real } = team;
    this.teamSelected = { _id, fullName, sponsor, name, city, abbreviation, real };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Modifica squadra';
  }

  clona(team: Team): void {
    const { fullName, sponsor, name, city, abbreviation, real } = team;
    this.teamSelected = { fullName, sponsor, name, city, abbreviation, real };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Clona squadra';
  }

  async salva(team: Team) {
    try {
      if (team._id == null) {
        this.teamService.create(team).subscribe(() => {
          this.mostraPopupModifica = false;
          const title = 'Nuova squadra';
          const message = 'Nuova squadra inserita correttamente';
          this.sharedService.notifica(globals.toastType.success, title, message);
        });
      } else {
        this.teamService.update(team).subscribe(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica squadra';
          const message = 'Squadra modificata correttamente';
          this.sharedService.notifica(globals.toastType.success, title, message);
        });
      }
      this.teamSelected = undefined;
      this.teamService.read().subscribe((teams: Team[]) => {
        this.teams = teams;
      });
    } catch (error) {
      console.error(error);
    }
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

  apriPopupElimina(team: Team) {
    this.teamSelected = team;
    this.popupConfermaElimina.apriModale();
  }

  confermaElimina() {
    try {
      if (this.teamSelected) {
        this.teamService.delete(this.teamSelected._id).pipe(
          tap(() => {
            this.popupConfermaElimina.chiudiModale();
            const title = 'Squadra eliminata';
            const message = 'La squadra è stata eliminata correttamente';
            this.sharedService.notifica(globals.toastType.success, title, message);
            this.teamSelected = undefined;
          }),
          switchMap(() => this.teamService.read()),
          tap((teams: Team[]) => {
            this.teams = teams;
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  apriPopupUpload() {
    this.popupUpload.apriModale();
  }

  confermaUpload(file: File) {
    console.log('upload');
    console.log(file);

    const formData = new FormData();
    formData.append('teams', file);
    this.teamService.upload(formData).pipe(
      switchMap((teams: Team[]) => {
        return this.teamService.read();
      }),
    ).subscribe((teams: Team[]) => {
      this.teams = teams;
      this.popupUpload.chiudiModale();
    });
  }

}
