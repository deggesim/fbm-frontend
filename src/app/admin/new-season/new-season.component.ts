import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CupFormat } from 'src/app/models/formats/cup-format';
import { PlayoffFormat } from 'src/app/models/formats/playoff-format';
import { PlayoutFormat } from 'src/app/models/formats/playout-format';
import { RegularSeasonFormat } from 'src/app/models/formats/regular-season-format';
import { League } from 'src/app/models/league';

@Component({
  selector: 'app-new-season',
  templateUrl: './new-season.component.html',
  styleUrls: ['./new-season.component.scss']
})
export class NewSeasonComponent implements OnInit {

  form: FormGroup;

  regularSeasonFormatList: RegularSeasonFormat[] = [
    RegularSeasonFormat.SINGLE,
    RegularSeasonFormat.DOUBLE,
    RegularSeasonFormat.DOUBLE_PLUS,
    RegularSeasonFormat.TWO_DOUBLE
  ];

  playoffFormatList: PlayoffFormat[] = [
    PlayoffFormat.QF3SF5F5,
    PlayoffFormat.QF5SF5F5,
    PlayoffFormat.QF3SF5F7,
    PlayoffFormat.QF5SF5F7,
    PlayoffFormat.SF3F3,
    PlayoffFormat.SF3F5,
    PlayoffFormat.SF5F5,
    PlayoffFormat.SF5F7,
    PlayoffFormat.QF2SF5F5,
  ];

  playoutFormatList: PlayoutFormat[] = [
    PlayoutFormat.SF3F5,
    PlayoutFormat.SF5F5,
    PlayoutFormat.SRR4SF3F5,
    PlayoutFormat.SRR4SF5F5,
    PlayoutFormat.DRR4SF3F5,
    PlayoutFormat.DRR4SF5F5,
    PlayoutFormat.SRR4F5,
    PlayoutFormat.DRR4F5,
    PlayoutFormat.SF5F7,
  ];

  cupFormatList: CupFormat[] = [
    CupFormat.F8,
    CupFormat.QF2F4,
    CupFormat.QF2SF2F,
    CupFormat.QF2SF2F2,
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      realGames: [34, Validators.required],
      regularSeasonFormat: [undefined, Validators.required],
      playoffFormat: [undefined, Validators.required],
      playoutFormat: [undefined, Validators.required],
      cupFormat: [undefined, Validators.required],
      roundRobinFirstRealFixture: [1, Validators.required],
      playoffFirstRealFixture: [19, Validators.required],
      playoutFirstRealFixture: [19, Validators.required],
      cupFirstRealFixture: [10, Validators.required],
    });
  }

  step2(): void {
    const league: League = {
      name: this.form.value.name,
      realGames: this.form.value.realGames,
      regularSeasonFormat: this.form.value.regularSeasonFormat,
      playoffFormat: this.form.value.playoffFormat,
      playoutFormat: this.form.value.playoutFormat,
      cupFormat: this.form.value.cupFormat,
      roundRobinFirstRealFixture: this.form.value.roundRobinFirstRealFixture,
      playoffFirstRealFixture: this.form.value.playoffFirstRealFixture,
      playoutFirstRealFixture: this.form.value.playoutFirstRealFixture,
      cupFirstRealFixture: this.form.value.cupFirstRealFixture,
    };
    this.router.navigate(['../step-two'], {
      relativeTo: this.route,
      state: {
        data: league
      }
    });
  }

}
