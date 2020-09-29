import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Fixture } from '@app/shared/models/fixture';
import { Parameter } from '@app/shared/models/league';
import { Match } from '@app/shared/models/match';
import { Round } from '@app/shared/models/round';
import { TableItem } from '@app/shared/models/table-item';
import { LeagueService } from '@app/shared/services/league.service';
import { calculator } from '@app/shared/util/standings';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  form: FormGroup;
  rounds: Round[];
  selectedRound: Round;
  table: TableItem[] = [];
  nextFixture: Fixture;
  trend: Parameter;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init StandingsComponent');
    this.route.data.subscribe(
      (data) => {
        this.rounds = data.rounds.filter((round: Round) => round.roundRobin);
        this.leagueService.nextFixture().subscribe((nextFixture: Fixture) => {
          this.nextFixture = nextFixture;
        });
      }
    );
  }

  onChange(round: Round) {
    this.selectedRound = round;
    this.table = [];
    this.loadTable();
  }

  createForm() {
    this.form = this.fb.group({
      round: [undefined, Validators.required],
    });
  }

  reset() {
    this.form.reset();
    this.selectedRound = null;
  }

  loadTable() {
    if (this.selectedRound.roundRobin) {
      const matches: Match[] = [];
      for (const fixture of this.selectedRound.fixtures) {
        matches.push(...fixture.matches);
      }

      for (const fantasyTeam of this.selectedRound.fantasyTeams) {
        this.trend = this.leagueService.getSelectedLeague().parameters.find((parameter: Parameter) => parameter.parameter === 'TREND');
        const tableItem = calculator(fantasyTeam, matches, this.trend.value);
        this.table.push(tableItem);
      }

      this.table.sort((a: TableItem, b: TableItem): number => {
        if (a.points === b.points) {
          return b.difference - a.difference;
        } else {
          return b.points - a.points;
        }
      });
    }
  }

}
