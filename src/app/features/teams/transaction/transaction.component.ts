import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { user } from '@app/core/user/store/user.selector';
import { FantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { LeagueInfo } from '@app/models/league';
import { Roster, RosterList } from '@app/models/roster';
import { Role, User } from '@app/models/user';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { RosterService } from '@app/shared/services/roster.service';
import { ToastService } from '@app/shared/services/toast.service';
import { select, Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { iif, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-transaction',
  templateUrl: './transaction.component.html',
})
export class TransactionComponent implements OnInit {
  form = this.fb.group({
    fantasyTeam: [null as FantasyTeam, [Validators.required]],
    roster: [null as Roster],
    status: [null as string, [Validators.required]],
    draft: [null as boolean, [Validators.required]],
    contract: [1, [Validators.required]],
    yearContract: [1, [Validators.required]],
  });

  fantasyTeams: FantasyTeam[];
  fantasyTeamSelected: FantasyTeam;
  rosters: Roster[];
  rosterSelected: Roster;
  fantasyRosters: FantasyRoster[];
  fantasyRosterSelected: FantasyRoster;
  statusList = ['EXT', 'COM', 'ITA'];

  limit = 10;
  typeahead$ = new Subject<string>();

  @ViewChild('popupRelease', { static: false }) public popupRelease: PopupConfirmComponent;
  @ViewChild('popupRemove', { static: false }) public popupRemove: PopupConfirmComponent;
  @ViewChild('modalTransaction', { static: false }) private modalTransaction: ModalDirective;
  showModalTransaction: boolean;

  private route: ActivatedRoute;
  private toastService: ToastService;
  private rosterService: RosterService;
  private fantasyRosterService: FantasyRosterService;
  private fantasyTeamService: FantasyTeamService;
  private store: Store<AppState>;

  constructor(injector: Injector, private fb: FormBuilder) {
    this.route = injector.get(ActivatedRoute);
    this.toastService = injector.get(ToastService);
    this.rosterService = injector.get(RosterService);
    this.fantasyRosterService = injector.get(FantasyRosterService);
    this.fantasyTeamService = injector.get(FantasyTeamService);
    this.store = injector.get(Store);

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

  ngOnInit() {
    this.fantasyTeams = this.route.snapshot.data['fantasyTeams'];
    this.rosters = this.route.snapshot.data['rosterList'].content;

    this.store.pipe(select(user), take(1)).subscribe((value: User) => {
      const isAdmin = value && (Role.Admin === value.role || Role.SuperAdmin === value.role);
      if (!isAdmin) {
        this.fantasyTeams = this.fantasyTeams.filter(
          (fantasyTeam: FantasyTeam) => fantasyTeam.owners.find((owner: User) => owner._id === value._id) != null
        );
      }
    });

    this.typeahead$
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        switchMap((value: string) =>
          iif(
            () => this.showModalTransaction,
            of({ totalElements: this.rosters.length, content: this.rosters }),
            this.rosterService.freePlayers(1, this.limit, value)
          )
        )
      )
      .subscribe((rosterList: RosterList) => {
        this.rosters = rosterList.content;
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
      if (this.rosterSelected != null) {
        this.resetForm();
        this.showModalTransaction = true;
      }
    } else {
      this.fantasyRosters = null;
    }
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
      this.showModalTransaction = true;
    }
  }

  save() {
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
          tap(() => {
            this.hideModal();
          }),
          switchMap(() => this.fantasyTeamService.read()),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
            this.fantasyTeamSelected = fantasyTeams.find((ft: FantasyTeam) => this.fantasyTeamSelected._id === ft._id);
          }),
          switchMap(() => this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMap(() => this.store.select(leagueInfo)),
          take(1),
          switchMap((value: LeagueInfo) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, value.nextRealFixture._id))
        )
        .subscribe((fr: FantasyRoster[]) => {
          this.fantasyRosters = fr;
          this.toastService.success(
            'Modifica tesseramento',
            `Il tesseramento del giocatore ${this.fantasyRosterSelected.roster.player.name} è stato modificato correttamente`
          );
          this.rosterSelected = null;
          this.form.get('roster').reset();
          this.fantasyRosterSelected = null;
        });
    } else {
      const fantasyRoster = { ...this.form.value };
      this.fantasyRosterService
        .create(fantasyRoster as FantasyRoster)
        .pipe(
          tap(() => {
            this.hideModal();
          }),
          switchMap(() => this.fantasyTeamService.read()),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
            this.fantasyTeamSelected = fantasyTeams.find((ft: FantasyTeam) => this.fantasyTeamSelected._id === ft._id);
          }),
          switchMap(() => this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMap(() => this.store.select(leagueInfo)),
          take(1),
          switchMap((value: LeagueInfo) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, value.nextRealFixture._id))
        )
        .subscribe((fr: FantasyRoster[]) => {
          this.fantasyRosters = fr;
          this.toastService.success(
            'Nuovo tesseramento',
            `Il giocatore ${this.rosterSelected.player.name} è stato tesserarato correttamente`
          );
          this.rosterSelected = null;
          this.form.get('roster').reset();
        });
    }
  }

  hideModal(): void {
    this.modalTransaction.hide();
    this.resetForm();
    this.rosterSelected = null;
    this.form.get('roster').reset();
  }

  onHidden(): void {
    this.showModalTransaction = false;
  }

  update(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.form.patchValue({
      status: fantasyRoster.status,
      draft: fantasyRoster.draft,
      contract: fantasyRoster.contract,
      yearContract: fantasyRoster.yearContract,
    });
    this.rosterSelected = null;
    this.form.get('roster').reset();
    this.showModalTransaction = true;
  }

  openReleasePopup(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.popupRelease.openModal();
  }

  openRemovePopup(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.popupRemove.openModal();
  }

  remove() {
    this.fantasyRosterService
      .remove(this.fantasyRosterSelected._id)
      .pipe(
        switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
        tap((fantasyTeam: FantasyTeam) => {
          this.fantasyTeamSelected = fantasyTeam;
        }),
        switchMap(() => this.store.select(leagueInfo)),
        take(1),
        switchMap((value: LeagueInfo) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, value.nextRealFixture._id))
      )
      .subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters = fantasyRosters;
        this.toastService.success(
          'Giocatore rimosso',
          'Il giocatore ' + this.fantasyRosterSelected.roster.player.name + ' è stato rimosso correttamente'
        );
        this.popupRemove.closeModal();
        this.fantasyRosterSelected = null;
      });
  }

  release() {
    this.fantasyRosterService
      .release(this.fantasyRosterSelected._id)
      .pipe(
        switchMap(() => this.fantasyTeamService.get(this.fantasyTeamSelected._id)),
        tap((fantasyTeam: FantasyTeam) => {
          this.fantasyTeamSelected = fantasyTeam;
        }),
        switchMap(() => this.store.select(leagueInfo)),
        switchMap((value: LeagueInfo) => this.fantasyRosterService.read(this.fantasyTeamSelected._id, value.nextRealFixture._id))
      )
      .subscribe((fantasyRosters: FantasyRoster[]) => {
        this.fantasyRosters = fantasyRosters;
        this.toastService.success(
          'Giocatore rilasciato',
          'Il giocatore ' + this.fantasyRosterSelected.roster.player.name + ' è stato rilasciato correttamente'
        );
        this.popupRelease.closeModal();
        this.fantasyRosterSelected = null;
      });
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
