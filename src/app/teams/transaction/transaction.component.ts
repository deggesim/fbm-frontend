import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FantasyRoster } from 'src/app/models/fantasy-roster';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { Player } from 'src/app/models/player';
import { SharedService } from 'src/app/shared/shared.service';
import { FantasyRosterService } from 'src/app/services/fantasy-roster.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth.service';
import { Roster } from 'src/app/models/roster';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  form: FormGroup;

  fantasyRoster: FantasyRoster[];
  fantasyTeams: FantasyTeam[];
  rosters: Roster[];
  statusList = ['EXT', 'COM', 'ITA'];

  @ViewChild('modal', { static: false }) private modal: ModalDirective;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService,
    private fantasyRosterService: FantasyRosterService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init TransactionComponent');
    this.route.data.subscribe(
      (data) => {
        this.fantasyTeams = data.fantasyTeams;
        this.players = data.players;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      fantasyTeam: [undefined, Validators.required],
      player: [undefined, Validators.required],
      status: [undefined, Validators.required],
      draft: [false, Validators.required],
      contract: [1, Validators.required],
      yearContract: [1, Validators.required],
    });
  }

  selectFantasyTeam(fantasyTeam: FantasyTeam) {
    this.fantasyRoster = fantasyTeam.fantasyRosters;
  }

  selectPlayer(player: Player) {
    console.log(player);
    this.modal.show();
  }

  manageContract(draft: boolean) {
    if (draft) {
      this.form.get('contract').disable();
    } else {
      this.form.get('contract').enable();
    }
    console.log(draft);
  }

  save() {
    console.log(this.form.value);
  }

  annulla() {
    this.form.patchValue({
      status: undefined,
      draft: false,
      contract: 1,
      yearContract: 1,
    });
    this.modal.hide();
  }
}
