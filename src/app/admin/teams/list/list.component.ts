import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/team.service';
import { PopupConfermaComponent } from 'src/app/shared/popup-conferma/popup-conferma.component';
import { SharedService } from 'src/app/shared/shared.service';
import { toastType } from '../../../shared/globals';

@Component({
  selector: 'app-team-list',
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
        this.teams = data.teams;
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

  salva(team: Team) {
    if (team._id == null) {
      this.teamService.create(team).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Nuova squadra';
          const message = 'Nuova squadra inserita correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.teamSelected = undefined;
        }),
        switchMap(() => this.teamService.read())
      ).subscribe((teams: Team[]) => {
        this.teams = teams;
      });
    } else {
      this.teamService.update(team).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica squadra';
          const message = 'Squadra modificata correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.teamSelected = undefined;
        }),
        switchMap(() => this.teamService.read())
      ).subscribe((teams: Team[]) => {
        this.teams = teams;
      });
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
    if (this.teamSelected) {
      this.teamService.delete(this.teamSelected._id).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.popupConfermaElimina.chiudiModale();
          const title = 'Squadra eliminata';
          const message = 'La squadra è stata eliminata correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.teamSelected = undefined;
        }),
        switchMap(() => this.teamService.read()),
      ).subscribe((teams: Team[]) => {
        this.teams = teams;
      });
    }
  }

  apriPopupUpload() {
    this.popupUpload.apriModale();
  }

  confermaUpload(file: File) {
    this.teamService.upload(file).pipe(
      switchMap((teams: Team[]) => {
        return this.teamService.read();
      }),
    ).subscribe((teams: Team[]) => {
      this.teams = teams;
      this.popupUpload.chiudiModale();
    });
  }

}
