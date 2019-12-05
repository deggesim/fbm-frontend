import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegularSeasonFormat } from 'src/app/models/formats/regular-season-format';
import { League } from 'src/app/models/league';
import { NewSeasonService } from 'src/app/services/new-season.service';

@Component({
  selector: 'app-new-season',
  templateUrl: './new-season.component.html',
  styleUrls: ['./new-season.component.scss']
})
export class NewSeasonComponent implements OnInit {

  // form: FormGroup;

  // regularSeasonFormatList: RegularSeasonFormat[] = [
  //   RegularSeasonFormat.SINGLE,
  //   RegularSeasonFormat.DOUBLE,
  //   RegularSeasonFormat.DOUBLE_PLUS,
  //   RegularSeasonFormat.TWO_DOUBLE
  // ];

  // constructor(
  //   private fb: FormBuilder,
  //   private newSeasonService: NewSeasonService,
  //   private router: Router
  // ) {
  //   this.createForm();
  // }

  ngOnInit() {
  }

  // createForm() {
  //   this.form = this.fb.group({
  //     name: [undefined, Validators.required],
  //     realGames: [undefined, Validators.required],
  //     regularSeasonFormat: [undefined, Validators.required],
  //     playoffFormat: [undefined, Validators.required],
  //     playoutFormat: [undefined, Validators.required],
  //     cupFormat: [undefined, Validators.required],
  //     roundRobinFirstRealFixture: [undefined, Validators.required],
  //     playoffFirstRealFixture: [undefined, Validators.required],
  //     playoutFirstRealFixture: [undefined, Validators.required],
  //     cupFirstRealFixture: [undefined, Validators.required],
  //   });
  // }

  // confirm(): void {
  //   const league: League = {
  //     name: this.form.value.name,
  //     realGames: this.form.value.realGames,
  //     regularSeasonFormat: this.form.value.regularSeasonFormat,
  //     playoffFormat: this.form.value.playoffFormat,
  //     playoutFormat: this.form.value.playoutFormat,
  //     cupFormat: this.form.value.cupFormat,
  //     roundRobinFirstRealFixture: this.form.value.roundRobinFirstRealFixture,
  //     playoffFirstRealFixture: this.form.value.playoffFirstRealFixture,
  //     playoutFirstRealFixture: this.form.value.playoutFirstRealFixture,
  //     cupFirstRealFixture: this.form.value.cupFirstRealFixture,
  //   };
  //   this.newSeasonService.newSeason(league);
  //   this.router.navigate(['home']);
  // }

}
