import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FantasyTeam } from '@app/models/fantasy-team';

@Component({
  selector: 'fbm-rosters',
  templateUrl: './rosters.component.html',
})
export class RostersComponent implements OnInit {
  fantasyTeams: FantasyTeam[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];
  }
}
