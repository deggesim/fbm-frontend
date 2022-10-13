import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import * as LeagueInfoActions from '@app/core/league/store/league-info.actions';
import { selectedLeague } from '@app/core/league/store/league.selector';
import { UserService } from '@app/core/user/services/user.service';
import { Fixture } from '@app/models/fixture';
import { League } from '@app/models/league';
import { Lineup } from '@app/models/lineup';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { LineupService } from '@app/shared/services/lineup.service';
import { MatchService } from '@app/shared/services/match.service';
import { RoundService } from '@app/shared/services/round.service';
import { ToastService } from '@app/shared/services/toast.service';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { forkJoin, Observable } from 'rxjs';
import { switchMapTo, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent implements OnInit {
  form: UntypedFormGroup;
  rounds: Round[];
  selectedRound: Round;
  selectedFixture: Fixture;
  selectedMatch: Match;
  homeTeamLineup: Lineup[];
  awayTeamLineup: Lineup[];
  matches: Match[];
  isAdmin$: Observable<boolean>;

  @ViewChild('modalCalendarForm', { static: false }) modalCalendarForm: ModalDirective;
  @ViewChild('modalMatchResult', { static: false }) modalMatchResult: ModalDirective;
  showModalCalendarForm: boolean;
  showModalMatchResult: boolean;

  private fb: UntypedFormBuilder;
  private route: ActivatedRoute;
  private userService: UserService;
  private toastService: ToastService;
  private roundService: RoundService;
  private matchService: MatchService;
  private store: Store<AppState>;
  private lineupService: LineupService;

  constructor(injector: Injector) {
    this.fb = injector.get(UntypedFormBuilder);
    this.route = injector.get(ActivatedRoute);
    this.userService = injector.get(UserService);
    this.toastService = injector.get(ToastService);
    this.roundService = injector.get(RoundService);
    this.matchService = injector.get(MatchService);
    this.store = injector.get(Store);
    this.lineupService = injector.get(LineupService);
    this.createForm();
  }

  ngOnInit() {
    this.isAdmin$ = this.userService.isAdmin$();
    this.rounds = this.route.snapshot.data['rounds'];

    const round = this.route.snapshot.queryParams['round'];
    if (round) {
      this.selectedRound = this.rounds.find((value: Round) => value._id === round);
      this.form.get('round').setValue(this.selectedRound);
    }
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

  openModalCalendarForm(fixture: Fixture, event: any) {
    this.selectedFixture = fixture;
    this.matches = fixture.matches;
    this.showModalCalendarForm = true;
    // prevent accordion event
    event.stopPropagation();
    event.preventDefault();
  }

  hideModalCalendarForm(): void {
    this.modalCalendarForm?.hide();
  }

  onHiddenCalendarForm(): void {
    this.showModalCalendarForm = false;
  }

  save(matches: Match[]) {
    this.matchService
      .updateFixture(matches, this.selectedFixture._id)
      .pipe(
        tap(() => {
          this.hideModalCalendarForm();
        }),
        switchMapTo(this.store.select(selectedLeague)),
        tap((league: League) => {
          this.store.dispatch(LeagueInfoActions.refresh({ league }));
        }),
        switchMapTo(this.roundService.read())
      )
      .subscribe((rounds: Round[]) => {
        this.matches = undefined;
        this.selectedFixture = null;
        this.rounds = rounds;
        this.selectedRound = rounds.find((round: Round) => this.selectedRound._id === round._id);
        this.toastService.success('Modifica risultati', 'Risultati modificati correttamente');
      });
  }

  roundSearchFn = (term: string, round: Round) => {
    return round.name.toLowerCase().includes(term.toLowerCase()) || round.competition?.name.toLowerCase().includes(term.toLowerCase());
  };

  openModalMatchResult(fixture: Fixture, match: Match) {
    if (fixture != null && match != null) {
      this.selectedFixture = fixture;
      this.loadLineups(match).subscribe((lineups: [Lineup[], Lineup[]]) => {
        this.homeTeamLineup = lineups[0];
        this.awayTeamLineup = lineups[1];
        this.selectedMatch = match;
        this.showModalMatchResult = true;
      });
    }
  }

  hideModalMatchResult(): void {
    this.modalMatchResult?.hide();
  }

  onHiddenMatchResult(): void {
    this.showModalMatchResult = false;
  }

  private loadLineups(match: Match): Observable<[Lineup[], Lineup[]]> {
    const homeTeam = match.homeTeam;
    const awayTeam = match.awayTeam;
    const $homeTeamLineup = this.lineupService.lineupByTeam(homeTeam._id, this.selectedFixture._id);
    const $awayTeamLineup = this.lineupService.lineupByTeam(awayTeam._id, this.selectedFixture._id);
    return forkJoin([$homeTeamLineup, $awayTeamLineup]);
  }
}
