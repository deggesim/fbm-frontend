import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toastType } from '@app/shared/constants/globals';
import { Fixture } from '@app/shared/models/fixture';
import { Lineup } from '@app/shared/models/lineup';
import { Match } from '@app/shared/models/match';
import { Round } from '@app/shared/models/round';
import { LeagueService } from '@app/shared/services/league.service';
import { LineupService } from '@app/shared/services/lineup.service';
import { MatchService } from '@app/shared/services/match.service';
import { SharedService } from '@app/shared/services/shared.service';
import { isEmpty } from '@app/shared/util/is-empty';
import { refresh } from '@app/store/actions/league-info.actions';
import { Store } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  form: FormGroup;

  rounds: Round[];
  fixtures: Fixture[];
  matches: Match[];
  selectedMatch: Match;
  homeTeamLineup: Lineup[];
  awayTeamLineup: Lineup[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private lineupService: LineupService,
    private matchService: MatchService,
    private store: Store
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.rounds = data.rounds;
    });
  }

  createForm() {
    this.form = this.fb.group({
      round: [undefined, Validators.required],
      fixture: [undefined, Validators.required],
      match: [undefined, Validators.required],
    });
    this.form.get('fixture').disable();
    this.form.get('match').disable();
  }

  onChangeRound(round: Round) {
    this.form.get('fixture').reset();
    this.form.get('match').reset();
    if (round != null && round.fixtures != null && !isEmpty(round.fixtures)) {
      this.fixtures = round.fixtures;
      this.form.get('fixture').enable();
    } else {
      this.form.get('fixture').disable();
    }
  }

  onChangeFixture(fixture: Fixture) {
    this.form.get('match').reset();
    if (fixture != null && fixture.matches != null && !isEmpty(fixture.matches)) {
      this.matches = fixture.matches;
      this.form.get('match').enable();
    } else {
      this.form.get('match').disable();
    }
  }

  onChangeMatch(match: Match) {
    if (match != null) {
      this.selectedMatch = match;
      this.loadLineups(match).subscribe((lineups) => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
      });
    }
  }

  calcolaRisultato() {
    const { round, fixture, match } = this.form.value;
    this.matchService
      .compute(round._id, fixture._id, match._id)
      .pipe(
        tap((matchComputed) => {
          this.selectedMatch = matchComputed;
        }),
        switchMap(() => this.matchService.read(fixture._id)),
        tap((matches: Match[]) => {
          this.matches = matches;
        }),
        switchMap(() => {
          this.store.dispatch(refresh());
          return this.loadLineups(this.selectedMatch);
        })
      )
      .subscribe((lineups) => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
        const title = 'Risultato calcolato';
        const message = 'Il risultato è stato calcolato correttamente';
        this.sharedService.notifica(toastType.success, title, message);
      });
  }

  private loadLineups(match: Match): Observable<[Lineup[], Lineup[]]> {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.form.value.fixture._id);
    const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.form.value.fixture._id);
    return forkJoin([$homeTeamLineup, $awayTeamLineup]);
  }
}
