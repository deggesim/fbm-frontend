import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toastType } from '@app/shared/constants/globals';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { SharedService } from '@app/shared/services/shared.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-fantasy-team-list',
  templateUrl: './fantasy-team-list.component.html',
})
export class FantasyTeamListComponent implements OnInit {
  fantasyTeams: FantasyTeam[];

  fantasyTeamSelected: FantasyTeam;
  mostraPopupModifica: boolean;

  constructor(private route: ActivatedRoute, private sharedService: SharedService, private fantasyTeamService: FantasyTeamService) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.fantasyTeams = data.fantasyTeams;
    });
  }

  modifica(fantasyTeam: FantasyTeam): void {
    const {
      _id,
      name,
      initialBalance,
      outgo,
      totalContracts,
      playersInRoster,
      extraPlayers,
      pointsPenalty,
      balancePenalty,
      owners,
    } = fantasyTeam;
    this.fantasyTeamSelected = {
      _id,
      name,
      initialBalance,
      outgo,
      totalContracts,
      playersInRoster,
      extraPlayers,
      pointsPenalty,
      balancePenalty,
      owners,
    };
    this.mostraPopupModifica = true;
  }

  salva(fantasyTeam: FantasyTeam) {
    this.fantasyTeamService
      .update(fantasyTeam)
      .pipe(
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica squadra';
          const message = 'Squadra modificata correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.fantasyTeamSelected = undefined;
        }),
        switchMap(() => this.fantasyTeamService.read())
      )
      .subscribe((fantasyTeams: FantasyTeam[]) => {
        this.fantasyTeams = fantasyTeams;
      });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }
}
