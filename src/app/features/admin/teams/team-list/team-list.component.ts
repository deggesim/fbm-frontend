import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '@app/models/team';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { TeamService } from '@app/shared/services/team.service';
import { ToastService } from '@app/shared/services/toast.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-team-list',
  templateUrl: './team-list.component.html',
})
export class TeamListComponent implements OnInit {
  teams: Team[];

  teamSelected: Team;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfirmComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfirmComponent;
  @ViewChild('modalTeamForm', { static: false }) modalTeamForm: ModalDirective;
  showModalTeamForm: boolean;

  constructor(private route: ActivatedRoute, private toastService: ToastService, private teamService: TeamService) {}

  ngOnInit() {
    this.teams = this.route.snapshot.data['teams'];
  }

  newTeam() {
    this.teamSelected = undefined;
    this.showModalTeamForm = true;
    this.titoloModale = 'Nuova squadra';
  }

  update(team: Team): void {
    const { _id, fullName, sponsor, name, city, abbreviation, real } = team;
    this.teamSelected = { _id, fullName, sponsor, name, city, abbreviation, real };
    this.showModalTeamForm = true;
    this.titoloModale = 'Modifica squadra';
  }

  clone(team: Team): void {
    const { fullName, sponsor, name, city, abbreviation, real } = team;
    this.teamSelected = { fullName, sponsor, name, city, abbreviation, real };
    this.showModalTeamForm = true;
    this.titoloModale = 'Clona squadra';
  }

  save(team: Team) {
    if (team._id == null) {
      this.teamService
        .create(team)
        .pipe(
          tap(() => {
            this.hideModal();
          }),
          switchMap(() => this.teamService.read())
        )
        .subscribe((teams: Team[]) => {
          this.teams = teams;
          this.teamSelected = undefined;
          this.toastService.success('Nuova squadra', `La squadra ${team.fullName} è stata inserita correttamente`);
        });
    } else {
      this.teamService
        .update(team)
        .pipe(
          tap(() => {
            this.hideModal();
          }),
          switchMap(() => this.teamService.read())
        )
        .subscribe((teams: Team[]) => {
          this.teams = teams;
          this.teamSelected = undefined;
          this.toastService.success('Modifica squadra', `La squadra ${team.fullName} è stata modificata correttamente`);
        });
    }
  }

  hideModal(): void {
    this.modalTeamForm?.hide();
  }

  onHidden(): void {
    this.showModalTeamForm = false;
  }

  openDeletePopup(team: Team) {
    this.teamSelected = team;
    this.popupConfermaElimina.openModal();
  }

  confirmDelete() {
    if (this.teamSelected) {
      this.teamService
        .delete(this.teamSelected._id)
        .pipe(
          tap(() => {
            this.popupConfermaElimina.closeModal();
            this.toastService.success('Squadra eliminata', `La squadra ${this.teamSelected.fullName} è stata modificata correttamente`);
            this.teamSelected = undefined;
          }),
          switchMap(() => this.teamService.read())
        )
        .subscribe((teams: Team[]) => {
          this.teams = teams;
        });
    }
  }

  openUploadPopup() {
    this.popupUpload.openModal();
  }

  confirmUpload(file: File) {
    this.teamService
      .upload(file)
      .pipe(
        switchMap((teams: Team[]) => {
          return this.teamService.read();
        })
      )
      .subscribe((teams: Team[]) => {
        this.teams = teams;
        this.popupUpload.closeModal();
      });
  }
}
