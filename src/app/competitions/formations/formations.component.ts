import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FantasyRoster } from 'src/app/models/fantasy-roster';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { Fixture } from 'src/app/models/fixture';
import { Formation } from 'src/app/models/formation';
import { RealFixture } from 'src/app/models/real-fixture';
import { Round } from 'src/app/models/round';
import { FantasyRosterService } from 'src/app/services/fantasy-roster.service';
import { RealFixtureService } from 'src/app/services/real-fixture.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as globals from '../../shared/globals';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss']
})
export class FormationsComponent implements OnInit {

  form: FormGroup;

  rounds: Round[];
  selectedRound: Round;
  fixtures: Fixture[];
  selectedFixture: Fixture;
  realFixture: RealFixture;
  fantasyTeams: FantasyTeam[];
  selectedFantasyTeam: FantasyTeam;
  fantasyRosters: FantasyRoster[];
  formation: Formation[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private realFixtureService: RealFixtureService,
    private fantasyRosterService: FantasyRosterService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init FormationsComponent');
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
      fantasyTeam: [undefined, Validators.required],
      formation: [undefined, [Validators.required, this.formationValidator]],
    });
    this.form.get('fixture').disable();
    this.form.get('fantasyTeam').disable();
  }

  formationValidator = (control: AbstractControl) => {
    // tslint:disable-next-line: prefer-const
    let formationInvalid = false;
    // TODO controllo formazione
    if (formationInvalid) {
      return { formationInvalid: true };
    }
    return null;
  }

  onChangeRound(round: Round) {
    this.selectedRound = round;
    if (round.fixtures != null && round.fixtures.length > 0) {
      this.fixtures = round.fixtures;
    }
    if (round.fantasyTeams != null && round.fantasyTeams.length > 0) {
      this.fantasyTeams = round.fantasyTeams;
    }
    this.form.get('fixture').enable();
    this.form.get('fantasyTeam').enable();
  }

  onChangeFixture(fixture: Fixture) {
    this.selectedFixture = fixture;
  }

  onChangeFantasyTeam(fantasyTeam: FantasyTeam) {
    this.realFixtureService.getByFixture(this.selectedFixture._id).pipe(
      switchMap((realFixture: RealFixture) => this.fantasyRosterService.read(fantasyTeam._id, realFixture._id))
    ).subscribe((fantasyRosters: FantasyRoster[]) => {
      this.fantasyRosters = fantasyRosters;
      console.log(this.fantasyRosters);
    });
  }

  reset() {
    this.form.reset();
    this.selectedRound = null;
    this.fixtures = null;
    this.selectedFixture = null;
    this.fantasyTeams = null;
    this.selectedFantasyTeam = null;
    this.fantasyRosters = null;
    this.formation = null;
  }

  salva() {
    // TODO
    const title = 'Formazione salvata';
    const message = 'La formazione è stata salvata correttamente';
    this.sharedService.notifica(globals.toastType.success, title, message);
  }

  ripristina() {
    console.log('ripristina');
  }

  svuota() {
    console.log('svuota');
  }

  importa() {
    console.log('importa');
  }

  inviaEmail() {
    console.log('inviaEmail');
  }
}
