import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, switchMapTo, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-results',
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  form: UntypedFormGroup;

  rounds: Round[];
  fixtures: Fixture[];
  matches: Match[];
  selectedFixture: Fixture;
  selectedMatch: Match;
  homeTeamLineup: Lineup[];
  awayTeamLineup: Lineup[];

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private lineupService: LineupService,
    private matchService: MatchService,
    private store: Store<AppState>
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.rounds = this.route.snapshot.data['rounds'];

    const round = this.route.snapshot.queryParams['round'];
    const fixture = this.route.snapshot.queryParams['fixture'];
    const match = this.route.snapshot.queryParams['match'];

    if (round && fixture && match) {
      const selectedRound = this.rounds.find((value: Round) => value._id === round);
      if (selectedRound) {
        this.fixtures = selectedRound.fixtures;
        this.selectedFixture = this.fixtures?.find((value: Fixture) => value._id === fixture);
        this.matches = this.selectedFixture.matches;
        const selectedMatch = this.matches?.find((value: Match) => value._id === match);
        this.form.patchValue({
          round: selectedRound,
          fixture: this.selectedFixture,
          match: selectedMatch,
        });
        if (this.selectedFixture && selectedMatch) {
          this.form.get('fixture').enable();
          this.form.get('match').enable();
          this.onChangeMatch(selectedMatch);
        }
      }
    }
  }

  createForm() {
    this.form = this.fb.group({
      round: [null, Validators.required],
      fixture: [null, Validators.required],
      match: [null, Validators.required],
      homeFactor: [null, Validators.min(0)],
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
    if (fixture != null) {
      this.selectedFixture = fixture;
      this.form.get('match').reset();
      if (fixture != null && fixture.matches != null && !isEmpty(fixture.matches)) {
        this.matches = fixture.matches;
        this.form.get('match').enable();
      } else {
        this.form.get('match').disable();
      }
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

  computeScore() {
    const { round, fixture, match, homeFactor } = this.form.value;
    this.matchService
      .compute(round._id, fixture._id, match._id, homeFactor)
      .pipe(
        switchMap((matchComputed: Match) => {
          this.selectedMatch = matchComputed;
          return this.matchService.read(fixture._id);
        }),
        switchMap((matches: Match[]) => {
          this.matches = matches;
          return this.store.select(selectedLeague);
        }),
        switchMap((league: League) => {
          this.store.dispatch(LeagueInfoActions.refresh({ league }));
          return this.loadLineups(this.selectedMatch);
        })
      )
      .subscribe((lineups) => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
        this.toastService.success('Risultato calcolato', 'Il risultato è stato calcolato correttamente');
      });
  }

  roundSearchFn = (term: string, round: Round) => {
    return round.name.toLowerCase().includes(term.toLowerCase()) || round.competition?.name.toLowerCase().includes(term.toLowerCase());
  };

  private loadLineups(match: Match): Observable<[Lineup[], Lineup[]]> {
    this.form.get('homeFactor').setValue(match.homeFactor);
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.form.value.fixture._id);
    const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.form.value.fixture._id);
    return forkJoin([$homeTeamLineup, $awayTeamLineup]);
  }
}
