import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Fixture } from 'src/app/models/fixture';
import { Match } from 'src/app/models/match';
import { Round } from 'src/app/models/round';
import { AuthService } from 'src/app/services/auth.service';
import { RealFixtureService } from 'src/app/services/real-fixture.service';
import { isEmpty } from 'src/app/shared/globals';
import { SharedService } from 'src/app/shared/shared.service';
import { LineupService } from 'src/app/services/lineup.service';
import { forkJoin } from 'rxjs';
import { Lineup } from 'src/app/models/lineup';

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
  homeTeamLineup: Lineup[];
  awayTeamLineup: Lineup[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lineupService: LineupService,
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
      const homeTeam = match.homeTeam;
      const awayTeam = match.awayTeam;
      const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.form.value.fixture._id);
      const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.form.value.fixture._id);
      forkJoin([$homeTeamLineup, $awayTeamLineup]).subscribe(lineups => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
        if (this.homeTeamLineup != null && !isEmpty(this.homeTeamLineup)) {
          this.homeTeamLineup = this.homeTeamLineup.map((player: Lineup) => {
            return {
              fantasyRoster: player.fantasyRoster,
              spot: player.spot,
              benchOrder: player.benchOrder,
              fixture: player.fixture,
              matchReport: player.matchReport
            };
          });
          this.awayTeamLineup = this.awayTeamLineup.map((player: Lineup) => {
            return {
              fantasyRoster: player.fantasyRoster,
              spot: player.spot,
              benchOrder: player.benchOrder,
              fixture: player.fixture,
              matchReport: player.matchReport
            };
          });
        }
      });
    }
  }

}
