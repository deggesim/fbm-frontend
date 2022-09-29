import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { League, Parameter } from '@app/models/league';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { TableItem } from '@app/models/table-item';
import { calculator } from '@app/shared/util/standings';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'fbm-standings',
  templateUrl: './standings.component.html',
})
export class StandingsComponent implements OnInit {
  form: FormGroup;
  rounds: Round[];
  selectedRound: Round;
  table: TableItem[] = [];
  trend: Parameter;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private store: Store<AppState>) {
    this.createForm();
  }

  ngOnInit() {
    this.rounds = this.route.snapshot.data['rounds']?.filter((round: Round) => round.roundRobin);
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

      this.store.pipe(select(selectedLeague), take(1)).subscribe((league: League) => {
        for (const fantasyTeam of this.selectedRound.fantasyTeams) {
          this.trend = league.parameters.find((parameter: Parameter) => parameter.parameter === 'TREND');
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
      });
    }
  }

  roundSearchFn = (term: string, round: Round) => {
    return round.name.toLowerCase().includes(term.toLowerCase()) || round.competition?.name.toLowerCase().includes(term.toLowerCase());
  };
}
