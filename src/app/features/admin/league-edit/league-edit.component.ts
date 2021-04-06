import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeagueService } from '@app/core/league/services/league.service';
import { CupFormat } from '@app/models/formats/cup-format';
import { PlayoffFormat } from '@app/models/formats/playoff-format';
import { PlayoutFormat } from '@app/models/formats/playout-format';
import { RegularSeasonFormat } from '@app/models/formats/regular-season-format';
import { League } from '@app/models/league';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-league-edit',
  templateUrl: './league-edit.component.html',
})
export class EditLeagueComponent implements OnInit {
  form: FormGroup;

  league: League;

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private toastService: ToastService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.league = data.league;
      const {
        name,
        realGames,
        regularSeasonFormat,
        playoffFormat,
        playoutFormat,
        cupFormat,
        roundRobinFirstRealFixture,
        playoffFirstRealFixture,
        playoutFirstRealFixture,
        cupFirstRealFixture,
      } = this.league;
      this.form.setValue({
        name,
        realGames,
        regularSeasonFormat,
        playoffFormat,
        playoutFormat,
        cupFormat,
        roundRobinFirstRealFixture,
        playoffFirstRealFixture,
        playoutFirstRealFixture,
        cupFirstRealFixture,
      });
    });
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      realGames: [undefined, Validators.required],
      regularSeasonFormat: [undefined, Validators.required],
      playoffFormat: [undefined, Validators.required],
      playoutFormat: [undefined, Validators.required],
      cupFormat: [undefined, Validators.required],
      roundRobinFirstRealFixture: [undefined, Validators.required],
      playoffFirstRealFixture: [undefined, Validators.required],
      playoutFirstRealFixture: [undefined, Validators.required],
      cupFirstRealFixture: [undefined, Validators.required],
    });
  }

  confirm() {
    const league: League = {
      _id: this.league._id,
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
    this.leagueService.update(league).subscribe(() => {
      const title = 'Modifica lega';
      const message = 'Lega modificata con successo';
      this.toastService.success(title, message);
    });
  }
}
