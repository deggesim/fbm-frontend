import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Fixture } from 'src/app/models/fixture';
import { Match } from 'src/app/models/match';
import { Round } from 'src/app/models/round';
import { MatchService } from 'src/app/services/match.service';
import { RoundService } from 'src/app/services/round.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as globals from '../../../shared/globals';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  form: FormGroup;
  rounds: Round[];
  selectedRound: Round;
  matches: Match[];
  mostraPopupModifica: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private roundService: RoundService,
    private matchService: MatchService,
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

  modifica(fixture: Fixture, event: any) {
    console.log('modifica');
    this.matches = fixture.matches;
    this.mostraPopupModifica = true;
    event.stopPropagation(); event.preventDefault();
  }

  salva(matches: Match[]) {
    this.matchService.updateFixture(matches).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      tap(() => {
        this.mostraPopupModifica = false;
        const title = 'Modifica risultati';
        const message = 'Risultati modificati correttamente';
        this.sharedService.notifica(globals.toastType.success, title, message);
        this.matches = undefined;
      }),
      switchMap(() => this.roundService.read())
    ).subscribe((rounds: Round[]) => {
      this.rounds = rounds;
    });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }
}
