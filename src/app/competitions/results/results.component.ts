import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Fixture } from '@app/models/fixture';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { LineupService } from '@app/services/lineup.service';
import { MatchService } from '@app/services/match.service';
import { isEmpty, toastType } from '@app/shared/globals';
import { forkJoin } from 'rxjs';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
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
    private sharedService: SharedService,
    private lineupService: LineupService,
    private matchService: MatchService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init ResultsComponent');
    this.route.data.subscribe(
      (data) => {
        this.rounds = data.rounds;
      }
    );
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
      this.loadLineups(match);
    }
  }

  salva() {
    console.log('salva');
    const { round, fixture, match } = this.form.value;
    this.matchService.compute(round._id, fixture._id, match._id).subscribe((matchComputed) => {
      this.selectedMatch = matchComputed;
      const title = 'Risultato calcolato';
      const message = 'Il risultato è stato calcolato correttamente';
      this.sharedService.notifica(toastType.success, title, message);
      this.loadLineups(matchComputed);
    });
  }

  private loadLineups(match: Match) {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.form.value.fixture._id);
    const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.form.value.fixture._id);
    forkJoin([$homeTeamLineup, $awayTeamLineup]).subscribe(lineups => {
      this.homeTeamLineup = lineups[0];
      this.awayTeamLineup = lineups[1];
    });
  }

}