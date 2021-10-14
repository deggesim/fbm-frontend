import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { Role } from '@app/models/player';
import { PlayerStatisticList } from '@app/models/player-statistics';
import { Team } from '@app/models/team';
import { PlayerStatisticService } from '@app/shared/services/player-statistics.service';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'app-top-flop',
  templateUrl: './top-flop.component.html',
})
export class TopFlopComponent implements OnInit {
  roles: Role[];
  teams: Team[];
  playerStatisticList: PlayerStatisticList;

  form: FormGroup;

  // paginazione
  page = 1;
  limit = 10;
  maxSize = 5;
  boundaryLinks = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private playerStatisticService: PlayerStatisticService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.roles = [Role.Playmaker, Role.PlayGuardia, Role.Guardia, Role.GuardiaAla, Role.Ala, Role.AlaCentro, Role.Centro];
    this.teams = this.route.snapshot.data.teams;
    this.playerStatisticService.read(this.page, this.limit).subscribe((playerStatisticList: PlayerStatisticList) => {
      this.playerStatisticList = playerStatisticList;
    });
  }

  createForm() {
    this.form = this.fb.group({
      team: [],
      role: [],
    });
  }

  abilitaPaginazione() {
    return !isEmpty(this.playerStatisticList?.content) && this.playerStatisticList?.totalElements > this.limit;
  }

  pageChange(event) {
    this.page = event.page;
    this.playerStatisticService.read(this.page, this.limit).subscribe((playerStatisticList: PlayerStatisticList) => {
      this.playerStatisticList = playerStatisticList;
    });
  }
}
