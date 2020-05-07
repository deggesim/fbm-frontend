import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { RealFixture } from '@app/models/real-fixture';
import { FantasyRosterService } from '@app/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/services/fantasy-team.service';
import { LeagueService } from '@app/services/league.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {

  form: FormGroup;
  nextRealFixture: RealFixture;
  fantasyTeams1: FantasyTeam[];
  fantasyTeams2: FantasyTeam[];
  fantasyTeam1Selected: FantasyTeam;
  fantasyTeam2Selected: FantasyTeam;
  fantasyRosters1: FantasyRoster[];
  fantasyRoster1Selected: FantasyRoster;
  fantasyRosters2: FantasyRoster[];
  fantasyRoster2Selected: FantasyRoster;

  mostraPopupTradeBlock: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private fantasyRosterService: FantasyRosterService,
    private fantasyTeamService: FantasyTeamService,
  ) {
    this.createForm();
    this.leagueService.nextRealFixture().subscribe((realFixture: RealFixture) => {
      this.nextRealFixture = realFixture;
    });
  }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        this.fantasyTeams1 = data.fantasyTeams;
        this.fantasyTeams2 = data.fantasyTeams;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      fantasyTeam1: [undefined, Validators.required],
      fantasyTeam2: [undefined, Validators.required],
      outPlayers: [[], Validators.required],
      inPlayers: [[], Validators.required],
      buyout: [undefined, Validators.required],
    });
  }

  selectFantasyTeam1(fantasyTeam: FantasyTeam) {
    this.fantasyTeam1Selected = fantasyTeam;
    if (fantasyTeam != null) {
      this.fantasyRosterService.read(fantasyTeam._id, this.nextRealFixture._id).subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters1 = fantasyRosters;
      });
    }
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
    const fantasyRosters: FantasyRoster[] = this.form.get('outPlayers').value;
    const found = fantasyRosters.find((fr: FantasyRoster) => fr._id === fantasyRoster._id);
    return found != null;
  }

  player2Choosen(fantasyRoster: FantasyRoster): boolean {
    const fantasyRosters: FantasyRoster[] = this.form.get('inPlayers').value;
    const found = fantasyRosters.find((fr: FantasyRoster) => fr._id === fantasyRoster._id);
    return found != null;
  }

  addOutPlayerToTradeBlock(fantasyRoster: FantasyRoster) {
    const fantasyRosters: FantasyRoster[] = this.form.get('outPlayers').value;
    fantasyRosters.push(fantasyRoster);
  }

  addInPlayerToTradeBlock(fantasyRoster: FantasyRoster) {
    const fantasyRosters: FantasyRoster[] = this.form.get('inPlayers').value;
    fantasyRosters.push(fantasyRoster);
  }

  abilitaRiepilogo() {
    const outPlayers: FantasyRoster[] = this.form.get('outPlayers').value;
    const inPlayers: FantasyRoster[] = this.form.get('inPlayers').value;
    return outPlayers.concat(inPlayers).length > 0;
  }

  riepilogo() {
    this.mostraPopupTradeBlock = true;
  }

  salva() {
    console.log('salva');
    const outPlayers: FantasyRoster[] = this.form.get('outPlayers').value;
    const inPlayers: FantasyRoster[] = this.form.get('inPlayers').value;
    // for (const fr of outPlayers) {

    // }
    this.mostraPopupTradeBlock = false;
    this.form.patchValue({
      outPlayers: [],
      inPlayers: [],
      buyout: undefined
    });
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
      buyout: undefined
    });
    this.form.markAsPristine();
  }
}
