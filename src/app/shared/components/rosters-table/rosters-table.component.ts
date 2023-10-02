import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';

@Component({
  selector: 'fbm-rosters-table',
  templateUrl: './rosters-table.component.html',
  styleUrls: ['./rosters-table.component.scss'],
})
export class RostersTableComponent {
  @Input() fantasyTeams: FantasyTeam[];
  @Input() readOnly = true;
  playersInRoster = Array.from(Array(20).keys());

  @Output() update: EventEmitter<{ fantasyTeam: FantasyTeam; fantasyRoster: FantasyRoster }> = new EventEmitter();
  @Output() openRemovePopup: EventEmitter<FantasyRoster> = new EventEmitter();

  updateHandler(fantasyTeam: FantasyTeam, fantasyRoster: FantasyRoster) {
    this.update.emit({ fantasyTeam, fantasyRoster });
  }

  openRemovePopupHandler(fantasyRoster: FantasyRoster) {
    this.openRemovePopup.emit(fantasyRoster);
  }
}
