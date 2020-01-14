import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { Round } from 'src/app/models/round';
import { RoundService } from 'src/app/services/round.service';
import { SharedService } from 'src/app/shared/shared.service';
import * as globals from '../../shared/globals';


@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.scss']
})
export class RoundsComponent implements OnInit {

  form: FormGroup;

  rounds: Round[];
  fantasyTeams: FantasyTeam[];
  selectedRound: Round;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private roundService: RoundService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init RoundsComponent');
    this.route.data.subscribe(
      (data) => {
        this.rounds = data.rounds;
        this.fantasyTeams = data.fantasyTeams;
        this.form.get('unsortedList').setValue(this.fantasyTeams);
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      round: [undefined, Validators.required],
      unsortedList: [undefined],
      sortedList: [undefined, this.checkLength()],
    });
  }

  checkLength(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log('checkLength - control.value.length = ' + (control.value ? control.value.length : ''));
      if (this.form && this.form.value.round) {
        console.log('this.form.value.round', this.form.value.round);
        const lengthRequested = this.form.value.round.teams;
        const wrongValue = control.value.length !== lengthRequested;
        console.log(wrongValue);
        console.log(this.form.valid);
        console.log('this.form.get(\'round\').errors', this.form.get('round').errors);
        console.log('this.form.get(\'unsortedList\').errors', this.form.get('unsortedList').errors);
        console.log('this.form.get(\'sortedList\').errors', this.form.get('sortedList').errors);
        return wrongValue ? { wrongLength: { value: lengthRequested } } : null;
      }
    };
  }

  onChange(round: Round) {
    this.selectedRound = round;
    if (round.fantasyTeams != null && round.fantasyTeams.length > 0) {
      this.form.get('unsortedList').reset();
      this.form.get('sortedList').setValue(round.fantasyTeams);
    } else {
      this.form.get('unsortedList').setValue(this.fantasyTeams);
      this.form.get('sortedList').reset();
    }
  }

  reset() {
    this.form.reset();
    this.selectedRound = null;
  }

  async save() {
    this.selectedRound.fantasyTeams = this.form.value.sortedList;
    this.roundService.matches(this.selectedRound).subscribe((round: Round) => {
      const title = 'Generazione incontri';
      const message = 'Il calendario del round è stato generato correttamente';
      this.sharedService.notifica(globals.toastType.success, title, message);
      this.selectedRound = round;
    });
  }

}
