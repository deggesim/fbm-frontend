import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { LeagueInfo } from '@app/models/league';
import { RealFixture } from '@app/models/real-fixture';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { ToastService } from '@app/shared/services/toast.service';
import { fantasyTeamMustBeDifferent } from '@app/shared/util/validations';
import { select, Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { forkJoin, Observable } from 'rxjs';
import { switchMapTo, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  form: FormGroup;
  nextRealFixture: RealFixture;
  fantasyTeams: FantasyTeam[];
  fantasyTeam1Selected: FantasyTeam;
  fantasyTeam2Selected: FantasyTeam;
  fantasyRosters1: FantasyRoster[];
  fantasyRosters1Selected: FantasyRoster[] = [];
  fantasyRosters2: FantasyRoster[];
  fantasyRosters2Selected: FantasyRoster[] = [];

  @ViewChild('modalTradeBlock', { static: false }) modalTradeBlock: ModalDirective;
  showModalTradeBlock: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private fantasyRosterService: FantasyRosterService,
    private fantasyTeamService: FantasyTeamService,
    private store: Store<AppState>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];
    this.store.pipe(select(leagueInfo), take(1)).subscribe((li: LeagueInfo) => {
      this.nextRealFixture = li.nextRealFixture;
    });
  }

  createForm() {
    this.form = this.fb.group(
      {
        fantasyTeam1: [null, Validators.required],
        fantasyTeam2: [null, [Validators.required]],
        outPlayers: [[], Validators.required],
        inPlayers: [[], Validators.required],
        buyout: [null],
      },
      { validators: fantasyTeamMustBeDifferent }
    );
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

  enableRecap() {
    return this.fantasyRosters1Selected.length > 0;
  }

  recap() {
    this.showModalTradeBlock = true;
  }

  save() {
    for (const fr of this.fantasyRosters1Selected) {
      fr.fantasyTeam = this.fantasyTeam2Selected;
    }
    for (const fr of this.fantasyRosters2Selected) {
      fr.fantasyTeam = this.fantasyTeam1Selected;
    }

    const buyout = this.form.value.buyout ? this.form.value.buyout : 0;
    this.fantasyTeam1Selected.outgo += buyout;
    this.fantasyTeam2Selected.outgo -= buyout;
    this.fantasyTeam1Selected.playersInRoster += this.fantasyRosters2Selected.length - this.fantasyRosters1Selected.length;
    this.fantasyTeam2Selected.playersInRoster += this.fantasyRosters1Selected.length - this.fantasyRosters2Selected.length;
    this.fantasyTeam1Selected.totalContracts +=
      this.fantasyRosters2Selected.length - this.fantasyRosters1Selected.length > 0
        ? this.fantasyRosters2Selected.length - this.fantasyRosters1Selected.length
        : 0;

    this.fantasyTeam2Selected.totalContracts +=
      this.fantasyRosters1Selected.length - this.fantasyRosters2Selected.length > 0
        ? this.fantasyRosters1Selected.length - this.fantasyRosters2Selected.length
        : 0;

    const allTradedPlayers = this.fantasyRosters1Selected.concat(this.fantasyRosters2Selected);
    const allTradedPlayers$ = allTradedPlayers.map((fr: FantasyRoster) => this.fantasyRosterService.switch(fr));
    const all$: Observable<FantasyRoster | FantasyTeam>[] = []
      .concat(allTradedPlayers$)
      .concat(this.fantasyTeamService.update(this.fantasyTeam1Selected), this.fantasyTeamService.update(this.fantasyTeam2Selected));

    forkJoin(all$)
      .pipe(
        tap(() => {
          this.hideModal();
        }),
        switchMapTo(this.fantasyRosterService.read(this.fantasyTeam1Selected._id, this.nextRealFixture._id)),
        tap((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRosters1 = fantasyRosters;
        }),
        switchMapTo(this.fantasyRosterService.read(this.fantasyTeam2Selected._id, this.nextRealFixture._id)),
        tap((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRosters2 = fantasyRosters;
        }),
        switchMapTo(this.fantasyTeamService.read()),
        tap((fantasyTeams: FantasyTeam[]) => {
          this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
          this.fantasyTeam1Selected = this.fantasyTeams.find((ft: FantasyTeam) => this.fantasyTeam1Selected._id === ft._id);
          this.fantasyTeam2Selected = this.fantasyTeams.find((ft: FantasyTeam) => this.fantasyTeam2Selected._id === ft._id);
        })
      )
      .subscribe(() => {
        this.form.patchValue({
          outPlayers: [],
          inPlayers: [],
          buyout: undefined,
        });
        this.fantasyRosters1Selected = [];
        this.fantasyRosters2Selected = [];
        this.form.markAsPristine();
        this.toastService.success('Scambio completato', 'I giocatori sono stati scambiati con successo');
      });
  }

  hideModal(): void {
    this.modalTradeBlock.hide();
  }

  onHidden(): void {
    this.showModalTradeBlock = false;
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
