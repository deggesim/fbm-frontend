import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopupConfermaComponent } from '@app/shared/components/popup-conferma/popup-conferma.component';
import { toastType } from '@app/shared/constants/globals';
import { FantasyRoster } from '@app/shared/models/fantasy-roster';
import { FantasyTeam } from '@app/shared/models/fantasy-team';
import { LeagueInfo, Status } from '@app/shared/models/league';
import { RealFixture } from '@app/shared/models/real-fixture';
import { Roster, RosterList } from '@app/shared/models/roster';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { LeagueService } from '@app/shared/services/league.service';
import { RosterService } from '@app/shared/services/roster.service';
import { SharedService } from '@app/shared/services/shared.service';
import { AppState } from '@app/store/app.state';
import { leagueInfo } from '@app/store/selectors/league.selector';
import { select, Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { iif, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
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
  leagueStatus: Status;

  limit = 10;
  typeahead$ = new Subject();

  @ViewChild('modal', { static: false }) private modal: ModalDirective;
  @ViewChild('popupRilascia', { static: false }) public popupRilascia: PopupConfermaComponent;
  @ViewChild('popupRimuovi', { static: false }) public popupRimuovi: PopupConfermaComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private sharedService: SharedService,
    private rosterService: RosterService,
    private fantasyRosterService: FantasyRosterService,
    private fantasyTeamService: FantasyTeamService,
    private store: Store<AppState>
  ) {
    this.createForm();
    this.store.pipe(select(leagueInfo)).subscribe((leagueInfo: LeagueInfo) => {
      this.leagueStatus = leagueInfo?.status;
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.fantasyTeams = data.fantasyTeams;
      this.rosters = data.rosterList.content;
    });

    this.typeahead$
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        switchMap((value: string) => iif(() => this.modal.isShown, of(this.rosters), this.rosterService.freePlayers(1, this.limit, value)))
      )
      .subscribe((rosterList: RosterList) => {
        this.rosters = rosterList.content;
      });
  }

  createForm() {
    this.form = this.fb.group({
      fantasyTeam: [undefined, Validators.required],
      roster: [undefined],
      status: [undefined, Validators.required],
      draft: [false, Validators.required],
      contract: [1, Validators.required],
      yearContract: [1, Validators.required],
    });

    this.form.get('draft').valueChanges.subscribe((draft: boolean) => {
      if (draft) {
        this.form.get('contract').disable();
        this.form.get('yearContract').disable();
        this.form.get('yearContract').setValue(1);
      } else {
        this.form.get('contract').enable();
        this.form.get('yearContract').enable();
      }
    });
  }

  get transactionLabel() {
    return this.leagueStatus != null && this.leagueStatus === Status.Preseason ? 'Asta fantamercato' : 'Mercato libero';
  }

  selectFantasyTeam(fantasyTeam: FantasyTeam) {
    this.fantasyTeamSelected = fantasyTeam;
    if (fantasyTeam != null) {
      this.leagueService
        .nextRealFixture()
        .pipe(switchMap((nextRealFixture: RealFixture) => this.fantasyRosterService.read(fantasyTeam._id, nextRealFixture._id)))
        .subscribe((fantasyRosters: FantasyRoster[]) => {
          this.fantasyRosters = fantasyRosters;
        });
      if (this.rosterSelected != null) {
        this.resetForm();
        this.modal.show();
      }
    } else {
      this.fantasyRosters = null;
    }
  }

  clear() {
    this.limit = 10;
    this.rosterService.freePlayers(1, this.limit).subscribe((rosterList: RosterList) => {
      this.rosters = rosterList.content;
    });
  }

  loadMore() {
    this.limit += 10;
    this.rosterService.freePlayers(1, this.limit).subscribe((rosterList: RosterList) => {
      this.rosters = rosterList.content;
    });
  }

  selectRoster(roster: Roster) {
    this.rosterSelected = roster;
    if (this.fantasyTeamSelected != null) {
      this.resetForm();
      this.modal.show();
    }
  }

  salva() {
    this.limit = 10;
    if (this.fantasyRosterSelected) {
      const fantasyRoster: FantasyRoster = {
        _id: this.fantasyRosterSelected._id,
        roster: this.fantasyRosterSelected.roster,
        fantasyTeam: this.fantasyRosterSelected.fantasyTeam,
        status: this.form.value.status,
        draft: this.form.value.draft,
        contract: this.form.value.contract,
        yearContract: this.form.value.yearContract,
        realFixture: this.fantasyRosterSelected.realFixture,
      };
      this.fantasyRosterService
        .update(fantasyRoster)
        .pipe(
          // switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
          // tap((fantasyTeam: FantasyTeam) => {
          //   this.fantasyTeamSelected = fantasyTeam;
          // }),
          switchMap(() => this.fantasyTeamService.read()),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = fantasyTeams.sort((a, b) => a.name.localeCompare(b.name));
            this.fantasyTeamSelected = fantasyTeams.find((ft: FantasyTeam) => this.fantasyTeamSelected._id === ft._id);
          }),
          switchMap(() => this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMap(() => this.leagueService.nextRealFixture()),
          switchMap((nextRealFixture: RealFixture) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, nextRealFixture._id))
        )
        .subscribe((fr: FantasyRoster[]) => {
          this.fantasyRosters = fr;
          const title = 'Modifica tesseramento';
          const message = 'Tesseramento modificato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.rosterSelected = null;
          this.form.get('roster').reset();
          this.modal.hide();
          this.fantasyRosterSelected = null;
        });
    } else {
      const fantasyRoster: FantasyRoster = {
        ...this.form.value,
      };
      this.fantasyRosterService
        .create(fantasyRoster)
        .pipe(
          // switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
          // tap((fantasyTeam: FantasyTeam) => {
          //   this.fantasyTeamSelected = fantasyTeam;
          // }),
          switchMap(() => this.fantasyTeamService.read()),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = fantasyTeams.sort((a, b) => a.name.localeCompare(b.name));
            this.fantasyTeamSelected = fantasyTeams.find((ft: FantasyTeam) => this.fantasyTeamSelected._id === ft._id);
          }),
          switchMap(() => this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMap(() => this.leagueService.nextRealFixture()),
          switchMap((nextRealFixture: RealFixture) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, nextRealFixture._id))
        )
        .subscribe((fr: FantasyRoster[]) => {
          this.fantasyRosters = fr;
          const title = 'Nuovo tesseramento';
          const message = 'Giocatore tesserato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.rosterSelected = null;
          this.form.get('roster').reset();
          this.modal.hide();
        });
    }
  }

  annulla() {
    this.limit = 10;
    this.rosterService.freePlayers(1, this.limit).subscribe((rosterList: RosterList) => {
      this.rosters = rosterList.content;
    });
    this.resetForm();
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
    this.fantasyRosterService
      .remove(this.fantasyRosterSelected._id)
      .pipe(
        switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
        tap((fantasyTeam: FantasyTeam) => {
          this.fantasyTeamSelected = fantasyTeam;
        }),
        // switchMap(() => this.rosterService.freePlayers()),
        switchMap(() => this.leagueService.nextRealFixture()),
        switchMap((nextRealFixture: RealFixture) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, nextRealFixture._id))
      )
      .subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters = fantasyRosters;
        const title = 'Giocatore rimosso';
        const message = 'Il giocatore è stato rimosso correttamente.';
        this.sharedService.notifica(toastType.success, title, message);
        this.popupRimuovi.chiudiModale();
        this.fantasyRosterSelected = null;
      });
  }

  rilascia() {
    this.fantasyRosterService
      .release(this.fantasyRosterSelected._id)
      .pipe(
        switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
        tap((fantasyTeam: FantasyTeam) => {
          this.fantasyTeamSelected = fantasyTeam;
        }),
        // switchMap(() => this.rosterService.freePlayers()),
        switchMap(() => this.leagueService.nextRealFixture()),
        switchMap((nextRealFixture: RealFixture) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, nextRealFixture._id))
      )
      .subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters = fantasyRosters;
        const title = 'Giocatore rilasciato';
        const message = 'Il giocatore è stato rilasciato correttamente.';
        this.sharedService.notifica(toastType.success, title, message);
        this.popupRilascia.chiudiModale();
        this.fantasyRosterSelected = null;
      });
  }

  public isPreseason() {
    return this.leagueStatus != null && this.leagueStatus === Status.Preseason;
  }

  private resetForm() {
    this.form.patchValue({
      status: undefined,
      draft: false,
      contract: 1,
      yearContract: 1,
    });
    this.form.markAsPristine();
  }
}
