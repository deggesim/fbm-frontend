import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Round } from 'src/app/models/round';
import { TableItem } from 'src/app/models/table-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {

  form: FormGroup;
  rounds: Round[];
  selectedRound: Round;
  table: TableItem[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
    this.loadTable();
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

  loadTable() {
    if (this.selectedRound.roundRobin) {
      // TODO
    }
  }
}
