import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import { AuthService } from '@app/core/user/services/auth.service';
import { Fixture } from '@app/models/fixture';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { toastType } from '@app/shared/constants/globals';
import { MatchService } from '@app/shared/services/match.service';
import { RoundService } from '@app/shared/services/round.service';
import { SharedService } from '@app/shared/services/shared.service';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
})
export class CalendarListComponent implements OnInit {
  form: FormGroup;
  rounds: Round[];
  selectedRound: Round;
  selectedFixture: Fixture;
  matches: Match[];
  mostraPopupModifica: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public authService: AuthService,
    private sharedService: SharedService,
    private roundService: RoundService,
    private matchService: MatchService,
    private store: Store<AppState>
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
    });
  }

  onChange(round: Round) {
    this.selectedRound = round;
    this.selectedFixture = null;
  }

  reset() {
    this.form.reset();
    this.selectedRound = null;
    this.selectedFixture = null;
  }

  modifica(fixture: Fixture, event: any) {
    this.selectedFixture = fixture;
    this.matches = fixture.matches;
    this.mostraPopupModifica = true;
    // prevent accordion event
    event.stopPropagation();
    event.preventDefault();
  }

  salva(matches: Match[]) {
    this.matchService
      .updateFixture(matches, this.selectedFixture._id)
      .pipe(
        tap(() => {
          this.mostraPopupModifica = false;
          this.matches = undefined;
        }),
        switchMap(() => {
          this.store.dispatch(LeagueInfoActions.refresh());
          return this.roundService.read();
        })
      )
      .subscribe((rounds: Round[]) => {
        this.rounds = rounds;
        this.selectedRound = rounds.find((round: Round) => {
          return this.selectedRound._id === round._id;
        });
        this.selectedFixture = null;
        const title = 'Modifica risultati';
        const message = 'Risultati modificati correttamente';
        this.sharedService.notifica(toastType.success, title, message);
      });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }
}
