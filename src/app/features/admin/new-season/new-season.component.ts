import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CupFormat } from '@app/models/formats/cup-format';
import { PlayoffFormat } from '@app/models/formats/playoff-format';
import { PlayoutFormat } from '@app/models/formats/playout-format';
import { RegularSeasonFormat } from '@app/models/formats/regular-season-format';
import { League } from '@app/models/league';

@Component({
  selector: 'fbm-new-season',
  templateUrl: './new-season.component.html',
})
export class NewSeasonComponent {
  form = this.fb.group({
    name: [null as string, Validators.required],
    realGames: [30, Validators.required],
    regularSeasonFormat: [null as RegularSeasonFormat, Validators.required],
    playoffFormat: [null as PlayoffFormat, Validators.required],
    playoutFormat: [null as PlayoutFormat, Validators.required],
    cupFormat: [null as CupFormat, Validators.required],
    roundRobinFirstRealFixture: [1, Validators.required],
    playoffFirstRealFixture: [19, Validators.required],
    playoutFirstRealFixture: [19, Validators.required],
    cupFirstRealFixture: [10, Validators.required],
  });

  regularSeasonFormatList: RegularSeasonFormat[] = [
    RegularSeasonFormat.SINGLE,
    RegularSeasonFormat.DOUBLE,
    RegularSeasonFormat.DOUBLE_PLUS,
    RegularSeasonFormat.TWO_DOUBLE,
  ];

  playoffFormatList: PlayoffFormat[] = [
    PlayoffFormat.QF3_SF5_F5,
    PlayoffFormat.QF5_SF5_F5,
    PlayoffFormat.QF3_SF5_F7,
    PlayoffFormat.QF5_SF5_F7,
    PlayoffFormat.SF3_F3,
    PlayoffFormat.SF3_F5,
    PlayoffFormat.SF5_F5,
    PlayoffFormat.SF5_F7,
    PlayoffFormat.QF2_SQ8_SF5_F5,
    PlayoffFormat.QF2_SQ4_SF5_F5,
  ];

  playoutFormatList: PlayoutFormat[] = [
    PlayoutFormat.SF3_F5,
    PlayoutFormat.SF5_F5,
    PlayoutFormat.SRR4_SF3_F5,
    PlayoutFormat.SRR4_SF5_F5,
    PlayoutFormat.DRR4_SF3_F5,
    PlayoutFormat.DRR4_SF5_F5,
    PlayoutFormat.SRR4_F5,
    PlayoutFormat.DRR4_F5,
    PlayoutFormat.SF5_F7,
  ];

  cupFormatList: CupFormat[] = [CupFormat.F8, CupFormat.QF2_F4, CupFormat.QF2_SF2_F, CupFormat.QF2_SF2_F2];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

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
        data: league,
      },
    });
  }
}
