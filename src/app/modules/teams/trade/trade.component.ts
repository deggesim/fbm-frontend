import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toastType } from '@app/shared/constants/globals';
import { FantasyRoster } from '@app/shared/models/fantasy-roster';
import { FantasyTeam } from '@app/shared/models/fantasy-team';
import { RealFixture } from '@app/shared/models/real-fixture';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { LeagueService } from '@app/shared/services/league.service';
import { SharedService } from '@app/shared/services/shared.service';
import { fantasyTeamMustBeDifferent } from '@app/shared/util/validations';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  form: FormGroup;
  nextRealFixture: RealFixture;
  fantasyTeams1: FantasyTeam[];
  fantasyTeams2: FantasyTeam[];
  fantasyTeam1Selected: FantasyTeam;
  fantasyTeam2Selected: FantasyTeam;
  fantasyRosters1: FantasyRoster[];
  fantasyRosters1Selected: FantasyRoster[] = [];
  fantasyRosters2: FantasyRoster[];
  fantasyRosters2Selected: FantasyRoster[] = [];

  mostraPopupTradeBlock: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private fantasyRosterService: FantasyRosterService,
    private fantasyTeamService: FantasyTeamService
  ) {
    this.createForm();
    this.leagueService.nextRealFixture().subscribe((realFixture: RealFixture) => {
      this.nextRealFixture = realFixture;
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.fantasyTeams1 = data.fantasyTeams;
      this.fantasyTeams2 = data.fantasyTeams;
    });
  }

  createForm() {
    this.form = this.fb.group(
      {
        fantasyTeam1: [undefined, Validators.required],
        fantasyTeam2: [undefined, [Validators.required]],
        outPlayers: [[], Validators.required],
        inPlayers: [[], Validators.required],
        buyout: [undefined],
      },
      { validator: fantasyTeamMustBeDifferent }
    );
  }

  selectFantasyTeam1(fantasyTeam: FantasyTeam) {
    this.fantasyTeam1Selected = fantasyTeam;
    if (fantasyTeam != null) {
      this.fantasyRosterService.read(fantasyTeam._id, this.nextRealFixture._id).subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters1 = fantasyRosters;
      });
    }
    console.log(this.form.controls.fantasyTeam1);
  }

  selectFantasyTeam2(fantasyTeam: FantasyTeam) {
    this.fantasyTeam2Selected = fantasyTeam;
    if (fantasyTeam != null) {
      this.fantasyRosterService.read(fantasyTeam._id, this.nextRealFixture._id).subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters2 = fantasyRosters;
      });
    }
  }

  player1Choosen(fantasyRoster: FantasyRoster): boolean {
    const found = this.fantasyRosters1Selected.find((fr: FantasyRoster) => fr._id === fantasyRoster._id);
    return found != null;
  }

  player2Choosen(fantasyRoster: FantasyRoster): boolean {
    const fantasyRosters: FantasyRoster[] = this.form.get('inPlayers').value;
    const found = fantasyRosters.find((fr: FantasyRoster) => fr._id === fantasyRoster._id);
    return found != null;
  }

  switchOutPlayerToTradeBlock(fantasyRoster: FantasyRoster) {
    if (this.player1Choosen(fantasyRoster)) {
      const indexToRemove = this.fantasyRosters1Selected.findIndex((fr) => fr._id === fantasyRoster._id);
      this.fantasyRosters1Selected.splice(indexToRemove, 1);
    } else {
      this.fantasyRosters1Selected.push(fantasyRoster);
    }
    this.form.get('outPlayers').setValue(this.fantasyRosters1Selected);
  }

  switchInPlayerToTradeBlock(fantasyRoster: FantasyRoster) {
    if (this.player2Choosen(fantasyRoster)) {
      const indexToRemove = this.fantasyRosters2Selected.findIndex((fr) => fr._id === fantasyRoster._id);
      this.fantasyRosters2Selected.splice(indexToRemove, 1);
    } else {
      this.fantasyRosters2Selected.push(fantasyRoster);
    }
    this.form.get('inPlayers').setValue(this.fantasyRosters2Selected);
  }

  abilitaRiepilogo() {
    return this.fantasyRosters1Selected.length > 0;
  }

  riepilogo() {
    this.mostraPopupTradeBlock = true;
  }

  salva() {
    console.log('salva');
    for (const fr of this.fantasyRosters1Selected) {
      fr.fantasyTeam = this.fantasyTeam2Selected;
    }
    for (const fr of this.fantasyRosters2Selected) {
      fr.fantasyTeam = this.fantasyTeam1Selected;
    }
    this.fantasyTeam1Selected.outgo -= this.form.value.buyout;
    this.fantasyTeam2Selected.outgo += this.form.value.buyout;

    const allTradedPlayers = this.fantasyRosters1Selected.concat(this.fantasyRosters2Selected);
    const allTradedPlayers$ = allTradedPlayers.map((fr: FantasyRoster) => this.fantasyRosterService.update(fr));
    const all$: Observable<any>[] = []
      .concat(allTradedPlayers$)
      .concat(this.fantasyTeamService.update(this.fantasyTeam1Selected), this.fantasyTeamService.update(this.fantasyTeam2Selected));

    forkJoin(all$)
      .pipe(
        switchMap(() => this.fantasyRosterService.read(this.fantasyTeam1Selected._id, this.nextRealFixture._id)),
        tap((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRosters1 = fantasyRosters;
        }),
        switchMap(() => this.fantasyRosterService.read(this.fantasyTeam2Selected._id, this.nextRealFixture._id)),
        tap((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRosters2 = fantasyRosters;
        })
      )
      .subscribe(() => {
        const title = 'Scambio completato';
        const message = 'I giocatori sono stati scambiati con successo';
        this.sharedService.notifica(toastType.success, title, message);
      });

    this.mostraPopupTradeBlock = false;
    this.form.patchValue({
      outPlayers: [],
      inPlayers: [],
      buyout: undefined,
    });
    this.fantasyRosters1Selected = [];
    this.fantasyRosters2Selected = [];
    this.form.markAsPristine();
  }

  annulla() {
    console.log('annulla');
    this.mostraPopupTradeBlock = false;
  }

  reset() {
    this.form.patchValue({
      outPlayers: [],
      inPlayers: [],
      buyout: undefined,
    });
    this.fantasyRosters1Selected = [];
    this.fantasyRosters2Selected = [];
    this.form.markAsPristine();
  }
}
