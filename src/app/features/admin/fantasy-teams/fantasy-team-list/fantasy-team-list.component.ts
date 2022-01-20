import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { ToastService } from '@app/shared/services/toast.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-fantasy-team-list',
  templateUrl: './fantasy-team-list.component.html',
})
export class FantasyTeamListComponent implements OnInit {
  fantasyTeams: FantasyTeam[];

  fantasyTeamSelected: FantasyTeam;
  showPopupUpdate: boolean;

  constructor(private route: ActivatedRoute, private toastService: ToastService, private fantasyTeamService: FantasyTeamService) {}

  ngOnInit() {
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];
  }

  update(fantasyTeam: FantasyTeam): void {
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
    this.showPopupUpdate = true;
  }

  save(fantasyTeam: FantasyTeam) {
    this.fantasyTeamService
      .update(fantasyTeam)
      .pipe(
        tap(() => {
          this.showPopupUpdate = false;
          this.toastService.success('Modifica squadra', `Squadra ${fantasyTeam.name} modificata correttamente`);
          this.fantasyTeamSelected = undefined;
        }),
        switchMap(() => this.fantasyTeamService.read())
      )
      .subscribe((fantasyTeams: FantasyTeam[]) => {
        this.fantasyTeams = fantasyTeams;
      });
  }

  cancel(): void {
    this.showPopupUpdate = false;
  }
}
