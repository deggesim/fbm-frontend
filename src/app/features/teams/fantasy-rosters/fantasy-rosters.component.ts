import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { LeagueInfo } from '@app/models/league';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { select, Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'fbm-fantasy-rosters',
  templateUrl: './fantasy-rosters.component.html',
})
export class FantasyRostersComponent implements OnInit {
  form: FormGroup;

  fantasyTeams: FantasyTeam[];
  fantasyTeamSelected: FantasyTeam;
  fantasyRosters: FantasyRoster[];

  private fb: FormBuilder;
  private route: ActivatedRoute;
  private fantasyRosterService: FantasyRosterService;
  private store: Store<AppState>;

  constructor(injector: Injector) {
    this.fb = injector.get(FormBuilder);
    this.route = injector.get(ActivatedRoute);
    this.fantasyRosterService = injector.get(FantasyRosterService);
    this.store = injector.get(Store);

    this.createForm();
  }

  ngOnInit() {
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];

    const fantasyTeam = this.route.snapshot.queryParams['fantasyTeam'];
    if (fantasyTeam) {
      const fantasyTeamSelected = this.fantasyTeams.find((value: FantasyTeam) => value._id === fantasyTeam);
      this.form.get('fantasyTeam').setValue(fantasyTeamSelected);
      this.selectFantasyTeam(fantasyTeamSelected);
    }
  }

  createForm() {
    this.form = this.fb.group({
      fantasyTeam: [undefined, Validators.required],
    });
  }

  selectFantasyTeam(fantasyTeam: FantasyTeam) {
    this.fantasyTeamSelected = fantasyTeam;
    if (fantasyTeam != null) {
      this.store
        .pipe(
          select(leagueInfo),
          switchMap((value: LeagueInfo) => this.fantasyRosterService.read(fantasyTeam._id, value.nextRealFixture._id))
        )
        .subscribe((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRosters = fantasyRosters;
        });
    } else {
      this.fantasyRosters = null;
    }
  }
}
