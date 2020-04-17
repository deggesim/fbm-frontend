import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';
import { FantasyTeamService } from '@app/services/fantasy-team.service';
import { toastType } from '@app/shared/globals';
import { SharedService } from '@app/shared/shared.service';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-fantasy-team-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  fantasyTeams: FantasyTeam[];

  fantasyTeamSelected: FantasyTeam;
  mostraPopupModifica: boolean;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private fantasyTeamService: FantasyTeamService,
  ) { }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe(
      (data) => {
        this.fantasyTeams = data.fantasyTeams;
      }
    );
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
      owners
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
      owners
    };
    this.mostraPopupModifica = true;
  }

  salva(fantasyTeam: FantasyTeam) {
    this.fantasyTeamService.update(fantasyTeam).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      tap(() => {
        this.mostraPopupModifica = false;
        const title = 'Modifica squadra';
        const message = 'Squadra modificata correttamente';
        this.sharedService.notifica(toastType.success, title, message);
        this.fantasyTeamSelected = undefined;
      }),
      switchMap(() => this.fantasyTeamService.read())
    ).subscribe((fantasyTeams: FantasyTeam[]) => {
      this.fantasyTeams = fantasyTeams;
    });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

}
