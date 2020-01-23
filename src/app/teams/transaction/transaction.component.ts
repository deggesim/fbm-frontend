import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FantasyRoster } from 'src/app/models/fantasy-roster';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { Roster } from 'src/app/models/roster';
import { FantasyRosterService } from 'src/app/services/fantasy-roster.service';
import { FantasyTeamService } from 'src/app/services/fantasy-team.service';
import { RosterService } from 'src/app/services/roster.service';
import { PopupConfermaComponent } from 'src/app/shared/popup-conferma/popup-conferma.component';
import { SharedService } from 'src/app/shared/shared.service';
import * as globals from '../../shared/globals';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  form: FormGroup;

  fantasyTeams: FantasyTeam[];
  fantasyTeamSelected: FantasyTeam;
  rosters: Roster[];
  rosterSelected: Roster;
  fantasyRosters: FantasyRoster[];
  fantasyRosterSelected: FantasyRoster;
  statusList = ['EXT', 'COM', 'ITA'];

  @ViewChild('modal', { static: false }) private modal: ModalDirective;
  @ViewChild('popupRilascia', { static: false }) public popupRilascia: PopupConfermaComponent;
  @ViewChild('popupRimuovi', { static: false }) public popupRimuovi: PopupConfermaComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private rosterService: RosterService,
    private fantasyRosterService: FantasyRosterService,
    private fantasyTeamService: FantasyTeamService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('init TransactionComponent');
    this.route.data.subscribe(
      (data) => {
        this.fantasyTeams = data.fantasyTeams;
        this.rosters = data.rosters;
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      fantasyTeam: [undefined, Validators.required],
      roster: [undefined, Validators.required],
      status: [undefined, Validators.required],
      draft: [false, Validators.required],
      contract: [1, Validators.required],
      yearContract: [1, Validators.required],
    });
  }

  selectFantasyTeam(fantasyTeam: FantasyTeam) {
    this.fantasyTeamSelected = fantasyTeam;
    if (fantasyTeam != null) {
      this.fantasyRosterService.read(fantasyTeam._id).subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters = fantasyRosters;
      });
      if (this.rosterSelected != null) {
        this.modal.show();
      }
    } else {
      this.fantasyRosters = null;
    }
  }

  selectRoster(roster: Roster) {
    this.rosterSelected = roster;
    if (this.fantasyTeamSelected != null) {
      this.modal.show();
    }
  }

  manageContract(draft: boolean) {
    if (draft) {
      this.form.get('contract').disable();
    } else {
      this.form.get('contract').enable();
    }
    console.log(draft);
  }

  salva() {
    console.log(this.form.value);
    if (this.fantasyRosterSelected) {
      const fantasyRoster: FantasyRoster = {
        _id: this.fantasyRosterSelected._id,
        roster: this.fantasyRosterSelected.roster,
        ...this.form.value,
        realFixture: this.fantasyRosterSelected.realFixture
      };
      this.fantasyRosterService.update(fantasyRoster).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
        tap((fantasyTeam: FantasyTeam) => {
          this.fantasyTeamSelected = fantasyTeam;
        }),
        switchMap(() => this.rosterService.freePlayers()),
        tap((rosters: Roster[]) => { this.rosters = rosters; }),
        switchMap(() => this.fantasyRosterService.read(this.fantasyTeamSelected._id)),
      ).subscribe((fr: FantasyRoster[]) => {
        this.fantasyRosters = fr;
        const title = 'Modifica tesseramento';
        const message = 'Tesseramento modificato correttamente';
        this.sharedService.notifica(globals.toastType.success, title, message);
        this.rosterSelected = null;
        this.form.get('roster').reset();
        this.modal.hide();
      });
    } else {
      const fantasyRoster: FantasyRoster = {
        roster: this.rosterSelected,
        ...this.form.value,
      };
      this.fantasyRosterService.create(fantasyRoster).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
        tap((fantasyTeam: FantasyTeam) => {
          this.fantasyTeamSelected = fantasyTeam;
        }),
        switchMap(() => this.rosterService.freePlayers()),
        tap((rosters: Roster[]) => { this.rosters = rosters; }),
        switchMap(() => this.fantasyRosterService.read(this.fantasyTeamSelected._id)),
      ).subscribe((fr: FantasyRoster[]) => {
        this.fantasyRosters = fr;
        const title = 'Nuovo tesseramento';
        const message = 'Giocatore tesserato correttamente';
        this.sharedService.notifica(globals.toastType.success, title, message);
        this.rosterSelected = null;
        this.form.get('roster').reset();
        this.modal.hide();
      });
    }
  }

  annulla() {
    this.form.patchValue({
      status: undefined,
      draft: false,
      contract: 1,
      yearContract: 1,
    });
    this.rosterSelected = null;
    this.form.get('roster').reset();
    this.modal.hide();
  }

  modifica(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.form.patchValue({
      status: fantasyRoster.status,
      draft: fantasyRoster.draft,
      contract: fantasyRoster.contract,
      yearContract: fantasyRoster.yearContract,
    });
    this.rosterSelected = null;
    this.form.get('roster').reset();
    this.modal.show();
  }

  apriPopupRilascia(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.popupRilascia.apriModale();
  }

  apriPopupRimuovi(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.popupRimuovi.apriModale();
  }

  rimuovi() {
    this.fantasyRosterService.remove(this.fantasyRosterSelected._id).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
      tap((fantasyTeam: FantasyTeam) => {
        this.fantasyTeamSelected = fantasyTeam;
      }),
      switchMap(() => this.rosterService.freePlayers()),
      tap((rosters: Roster[]) => { this.rosters = rosters; }),
      switchMap(() => this.fantasyRosterService.read(this.fantasyTeamSelected._id)),
    ).subscribe((fantasyRosters: FantasyRoster[]) => {
      this.fantasyRosters = fantasyRosters;
      const title = 'Giocatore rimosso';
      const message = 'Il giocatore è stato rimosso correttamente.';
      this.sharedService.notifica(globals.toastType.success, title, message);
      this.popupRimuovi.chiudiModale();
    });
  }

  rilascia() {
    this.fantasyRosterService.release(this.fantasyRosterSelected._id).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
      tap((fantasyTeam: FantasyTeam) => {
        this.fantasyTeamSelected = fantasyTeam;
      }),
      switchMap(() => this.rosterService.freePlayers()),
      tap((rosters: Roster[]) => { this.rosters = rosters; }),
      switchMap(() => this.fantasyRosterService.read(this.fantasyTeamSelected._id)),
    ).subscribe((fantasyRosters: FantasyRoster[]) => {
      this.fantasyRosters = fantasyRosters;
      const title = 'Giocatore rilasciato';
      const message = 'Il giocatore è stato rilasciato correttamente.';
      this.sharedService.notifica(globals.toastType.success, title, message);
      this.popupRilascia.chiudiModale();
    });
  }
}
