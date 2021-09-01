import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { Fixture } from '@app/models/fixture';
import { League } from '@app/models/league';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { LineupService } from '@app/shared/services/lineup.service';
import { MatchService } from '@app/shared/services/match.service';
import { ToastService } from '@app/shared/services/toast.service';
import { isEmpty } from 'lodash-es';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, switchMapTo, tap } from 'rxjs/operators';

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
    private toastService: ToastService,
    private lineupService: LineupService,
    private matchService: MatchService,
    private store: Store<AppState>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.rounds = this.route.snapshot.data.rounds;
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
        switchMapTo(this.matchService.read(fixture._id)),
        tap((matches: Match[]) => {
          this.matches = matches;
        }),
        switchMapTo(this.store.select(selectedLeague)),
        tap((league: League) => {
          this.store.dispatch(LeagueInfoActions.refresh({ league }));
        }),
        switchMapTo(this.loadLineups(this.selectedMatch))
      )
      .subscribe((lineups) => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
        this.toastService.success('Risultato calcolato', 'Il risultato è stato calcolato correttamente');
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