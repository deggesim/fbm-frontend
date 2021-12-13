import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { AuthService } from '@app/core/auth/service/auth.service';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { UserService } from '@app/core/user/services/user.service';
import { Fixture } from '@app/models/fixture';
import { League } from '@app/models/league';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { MatchService } from '@app/shared/services/match.service';
import { RoundService } from '@app/shared/services/round.service';
import { ToastService } from '@app/shared/services/toast.service';
import { Store } from '@ngrx/store';
import { switchMap, switchMapTo, tap } from 'rxjs/operators';

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
  isAdmin$ = this.userService.isAdmin$();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private roundService: RoundService,
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
        switchMapTo(this.store.select(selectedLeague)),
        tap((league: League) => {
          this.store.dispatch(LeagueInfoActions.refresh({ league }));
        }),
        switchMapTo(this.roundService.read())
      )
      .subscribe((rounds: Round[]) => {
        this.rounds = rounds;
        this.selectedRound = rounds.find((round: Round) => {
          return this.selectedRound._id === round._id;
        });
        this.selectedFixture = null;
        this.toastService.success('Modifica risultati', 'Risultati modificati correttamente');
      });
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

  roundSearchFn = (term: string, round: Round) => {
    return round.name.toLowerCase().includes(term.toLowerCase()) || round.competition?.name.toLowerCase().includes(term.toLowerCase());
  };
}
