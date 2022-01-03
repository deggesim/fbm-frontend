import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';
import { Round } from '@app/models/round';
import { RoundService } from '@app/shared/services/round.service';
import { ToastService } from '@app/shared/services/toast.service';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.scss'],
})
export class RoundsComponent implements OnInit {
  form: FormGroup;

  rounds: Round[];
  selectedRound: Round;
  fantasyTeams: FantasyTeam[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private roundService: RoundService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.rounds = this.route.snapshot.data['rounds'];
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];
    this.form.get('unsortedList').setValue(this.fantasyTeams);
  }

  createForm() {
    this.form = this.fb.group({
      round: [undefined, Validators.required],
      unsortedList: [undefined],
      sortedList: [undefined, this.checkLength()],
    });
  }

  checkLength(): ValidatorFn {
    return (control: AbstractControl) => {
      if (this.form && this.form.value.round) {
        const lengthRequested = this.form.value.round.teams;
        const wrongValue = control.value.length !== lengthRequested;
        return wrongValue ? { wrongLength: { value: control.value.length } } : null;
      } else {
        return null;
      }
    };
  }

  onChange(round: Round) {
    this.selectedRound = round;
    if (round != null && round.fantasyTeams != null && !isEmpty(round.fantasyTeams)) {
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

  salva() {
    this.selectedRound.fantasyTeams = this.form.value.sortedList;
    this.roundService.matches(this.selectedRound).subscribe((round: Round) => {
      this.toastService.success('Generazione incontri', 'Il calendario del round è stato generato correttamente');
      this.selectedRound = round;
    });
  }

  roundSearchFn = (term: string, round: Round) => {
    return round.name.toLowerCase().includes(term.toLowerCase()) || round.competition?.name.toLowerCase().includes(term.toLowerCase());
  };
}
