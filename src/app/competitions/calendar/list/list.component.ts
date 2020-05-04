import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Fixture } from '@app/models/fixture';
import { Match } from '@app/models/match';
import { Round } from '@app/models/round';
import { LeagueService } from '@app/services/league.service';
import { MatchService } from '@app/services/match.service';
import { RoundService } from '@app/services/round.service';
import { toastType } from '@app/shared/globals';
import { SharedService } from '@app/shared/shared.service';
import { switchMap, tap } from 'rxjs/operators';

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
    private leagueService: LeagueService,
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
    // prevent accordion event
    event.stopPropagation();
    event.preventDefault();
  }

  salva(matches: Match[]) {
    this.matchService.updateFixture(matches, this.selectedFixture._id).pipe(
      tap(() => {
        this.mostraPopupModifica = false;
        this.matches = undefined;
      }),
      switchMap(() => this.leagueService.leagueInfoObservableChain),
      switchMap(() => this.roundService.read()),
    ).subscribe((rounds: Round[]) => {
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
