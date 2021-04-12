import { Injectable } from '@angular/core';
import { AppState } from '@app/core/app.state';
import { LocalStorageService } from '@app/core/local-storage.service';
import * as RouterActions from '@app/core/router/store/router.actions';
import { FantasyTeam } from '@app/models/fantasy-team';
import { League, LeagueInfo } from '@app/models/league';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { ToastService } from '@app/shared/services/toast.service';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of, zip } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LeagueService } from '../services/league.service';
import * as LeagueInfoActions from './league-info.actions';
import * as LeagueActions from './league.actions';
import { selectedLeague } from './league.selector';

@Injectable()
export class LeagueEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private leagueService: LeagueService,
    private fantasyTeamsService: FantasyTeamService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      mapTo(this.localStorageService.getSelectedLeague()),
      // we want dispatch an action only when selectedLeague is in localStorage
      filter((league: League) => !!league),
      map((league: League) => LeagueActions.setSelectedLeague({ league }))
    )
  );

  selectLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.selectLeague),
      switchMap(({ league }) =>
        this.leagueService.refresh$(league).pipe(
          switchMap((leagueInfo: LeagueInfo) => [
            LeagueActions.setSelectedLeague({ league }),
            LeagueInfoActions.refreshSuccess({ leagueInfo }),
            RouterActions.redirectAfterSelectLeague(),
          ]),
          tap(() => {
            this.localStorageService.setSelectedLeague(league);
          }),
          catchError(() => of(LeagueInfoActions.refreshFailed()))
        )
      )
    )
  );

  createLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.createLeague),
      switchMap(({ league, fantasyTeams }) =>
        this.leagueService.create(league).pipe(
          switchMap((league: League) => zip(of(league), this.fantasyTeamsService.create(fantasyTeams, league._id))),
          switchMap((result: [League, FantasyTeam[]]) => this.leagueService.populate(result[0])),
          switchMap((league: League) => [LeagueActions.createLeagueSuccess({ league }), RouterActions.go({ path: ['home'] })]),
          tap(() => {
            this.toastService.success('Creazione lega', `La lega ${league.name} è stata create con successo`);
          }),
          catchError(() => {
            this.toastService.error('Creazione lega', 'Errore nella creazione della lega');
            return of(LeagueActions.createLeagueFailed());
          })
        )
      )
    )
  );

  createLeagueSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.createLeagueSuccess),
      map(({ league }) => LeagueInfoActions.refresh({ league })),
      tap(({ league }) => {
        this.localStorageService.setSelectedLeague(league);
      })
    )
  );

  editLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.editLeague),
      switchMap(({ league }) =>
        this.leagueService.update(league).pipe(
          map((league: League) => LeagueActions.editLeagueSuccess({ league })),
          tap(() => {
            this.toastService.success('Modifica lega', 'Lega modificata con successo');
          }),
          catchError(() => {
            this.toastService.error('Modifica lega', 'Errore nella modifica della lega');
            return of(LeagueActions.editLeagueFailed());
          })
        )
      )
    )
  );

  editLeagueSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.editLeagueSuccess),
      map(({ league }) => LeagueInfoActions.refresh({ league })),
      tap(({ league }) => {
        this.localStorageService.setSelectedLeague(league);
      })
    )
  );

  completePreseason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.completePreseason),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, league]) =>
        this.leagueService.completePreseason(league._id).pipe(
          map((league: League) => LeagueActions.completePreseasonSuccess({ league })),
          tap(() => {
            this.toastService.success('Presason completata', 'Il torneo ora è nella fase "Stagione regolare"');
          }),
          catchError(() => {
            this.toastService.error("Errore nell'avanzamento", 'Errore nel completamento della preseason');
            return of(LeagueActions.completePreseasonFailed());
          })
        )
      )
    )
  );

  completePreseasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.completePreseasonSuccess),
      switchMap(({ league }) => [LeagueInfoActions.refresh({ league }), RouterActions.go({ path: ['home'] })])
    )
  );

  editParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.editParameters),
      withLatestFrom(this.store.pipe(select(selectedLeague))),
      switchMap(([action, selectedLeague]) =>
        this.leagueService.setParameters(selectedLeague._id, action.parameters).pipe(
          map((league: League) => LeagueActions.editParametersSuccess({ league })),
          tap(() => {
            this.toastService.success('Modifica parametri', 'I parametri della lega sono stati modificati con successo');
          }),
          catchError(() => {
            this.toastService.error('Modifica parametri', 'Errore nella modifica dei parametri');
            return of(LeagueActions.editParametersFailed());
          })
        )
      )
    )
  );

  editParametersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.editParametersSuccess),
      map(({ league }) => LeagueInfoActions.refresh({ league })),
      tap(({ league }) => {
        this.localStorageService.setSelectedLeague(league);
      })
    )
  );
}
