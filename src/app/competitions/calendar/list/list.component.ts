import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Fixture } from 'src/app/models/fixture';
import { Match } from 'src/app/models/match';
import { Round } from 'src/app/models/round';
import { FixtureService } from 'src/app/services/fixture.service';
import { MatchService } from 'src/app/services/match.service';
import { RoundService } from 'src/app/services/round.service';
import { SharedService } from 'src/app/shared/shared.service';
import { toastType } from '../../../shared/globals';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  form: FormGroup;
  rounds: Round[];
  selectedRound: Round;
  selectedFixture: Fixture;
  matches: Match[];
  mostraPopupModifica: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private roundService: RoundService,
    private matchService: MatchService,
    private fixtureService: FixtureService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init RoundsComponent');
    this.route.data.subscribe(
      (data) => {
        this.rounds = data.rounds;
      }
    );
  }

  onChange(round: Round) {
    this.selectedRound = round;
    this.selectedFixture = null;
  }

  createForm() {
    this.form = this.fb.group({
      round: [undefined, Validators.required],
    });
  }

  reset() {
    this.form.reset();
    this.selectedRound = null;
    this.selectedFixture = null;
  }

  modifica(fixture: Fixture, event: any) {
    console.log('modifica');
    this.selectedFixture = fixture;
    this.matches = fixture.matches;
    this.mostraPopupModifica = true;
    event.stopPropagation(); event.preventDefault();
  }

  salva(matches: Match[]) {
    this.matchService.updateFixture(matches, this.selectedFixture._id).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      tap(() => {
        this.mostraPopupModifica = false;
        const title = 'Modifica risultati';
        const message = 'Risultati modificati correttamente';
        this.sharedService.notifica(toastType.success, title, message);
        this.matches = undefined;
      }),
      switchMap(() => this.roundService.read()),
    ).subscribe((rounds: Round[]) => {
      this.rounds = rounds;
      this.selectedRound = rounds.find((round: Round) => {
        return this.selectedRound._id === round._id;
      });
      this.selectedFixture = null;
    });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }
}
