import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { user } from '@app/core/user/store/user.selector';
import { FantasyRoster, sortFantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { LeagueInfo, Status } from '@app/models/league';
import { Roster, RosterList } from '@app/models/roster';
import { Role, User } from '@app/models/user';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { RosterService } from '@app/shared/services/roster.service';
import { ToastService } from '@app/shared/services/toast.service';
import { select, Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged, iif, noop, of, Subject, switchMap, switchMapTo, take, tap } from 'rxjs';

@Component({
  selector: 'fbm-draft-board',
  templateUrl: './draft-board.component.html',
})
export class DraftBoardComponent implements OnInit {
  form: FormGroup;

  fantasyTeams: FantasyTeam[];
  rosters: Roster[];
  rosterSelected: Roster;
  fantasyRosters: FantasyRoster[];
  fantasyRosterSelected: FantasyRoster;
  statusList = ['EXT', 'COM', 'ITA'];
  leagueStatus: Status;

  limit = 10;
  typeahead$ = new Subject<string>();

  @ViewChild('popupRelease', { static: false }) public popupRelease: PopupConfirmComponent;
  @ViewChild('popupRemove', { static: false }) public popupRemove: PopupConfirmComponent;
  @ViewChild('modalTransaction', { static: false }) private modalTransaction: ModalDirective;
  showModalTransaction: boolean;

  private fb: FormBuilder;
  private route: ActivatedRoute;
  private toastService: ToastService;
  private rosterService: RosterService;
  private fantasyRosterService: FantasyRosterService;
  private fantasyTeamService: FantasyTeamService;
  private store: Store<AppState>;

  playersInRoster: number[];

  constructor(injector: Injector) {
    this.fb = injector.get(FormBuilder);
    this.route = injector.get(ActivatedRoute);
    this.toastService = injector.get(ToastService);
    this.rosterService = injector.get(RosterService);
    this.fantasyRosterService = injector.get(FantasyRosterService);
    this.fantasyTeamService = injector.get(FantasyTeamService);
    this.store = injector.get(Store);

    this.playersInRoster = Array.from(Array(16).keys());

    this.createForm();
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
    this.store.pipe(select(leagueInfo), take(1)).subscribe((value: LeagueInfo) => {
      this.leagueStatus = value?.status;
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

  loadMore() {
    this.limit += 10;
    this.rosterService.freePlayers(1, this.limit).subscribe((rosterList: RosterList) => {
      this.rosters = rosterList.content;
    });
  }

  selectRoster(roster: Roster) {
    this.rosterSelected = roster;
    this.resetForm();
    this.showModalTransaction = true;
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
            this.toastService.success(
              'Modifica tesseramento',
              `Il tesseramento del giocatore ${this.fantasyRosterSelected.roster.player.name} è stato modificato correttamente`
            );
            this.rosterSelected = null;
            this.form.get('roster').reset();
            this.fantasyRosterSelected = null;
          }),
          switchMapTo(this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMapTo(this.store.select(leagueInfo)),
          take(1),
          switchMapTo(this.fantasyTeamService.draftBoard(true)),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
            for (const ft of this.fantasyTeams) {
              ft.fantasyRosters = [...ft.fantasyRosters].sort(sortFantasyRoster);
            }
          })
        )
        .subscribe(noop);
    } else {
      const fantasyRoster: FantasyRoster = {
        ...this.form.value,
      };
      this.fantasyRosterService
        .create(fantasyRoster)
        .pipe(
          tap(() => {
            this.hideModal();
            this.toastService.success(
              'Nuovo tesseramento',
              `Il giocatore ${fantasyRoster.roster.player.name} è stato tesserarato correttamente`
            );
            this.rosterSelected = null;
            this.form.get('roster').reset();
          }),
          switchMapTo(this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMapTo(this.store.select(leagueInfo)),
          take(1),
          switchMapTo(this.fantasyTeamService.draftBoard(true)),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
            for (const ft of this.fantasyTeams) {
              ft.fantasyRosters = [...ft.fantasyRosters].sort(sortFantasyRoster);
            }
          })
        )
        .subscribe(noop);
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

  update(fantasyTeam: FantasyTeam, fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.form.patchValue({
      fantasyTeam,
      status: fantasyRoster.status,
      draft: fantasyRoster.draft,
      contract: fantasyRoster.contract,
      yearContract: fantasyRoster.yearContract,
    });
    this.rosterSelected = null;
    this.form.get('roster').reset();
    this.showModalTransaction = true;
  }

  openRemovePopup(fantasyRoster: FantasyRoster) {
    this.fantasyRosterSelected = fantasyRoster;
    this.popupRemove.openModal();
  }

  remove() {
    this.fantasyRosterService
      .remove(this.fantasyRosterSelected._id)
      .pipe(
        tap(() => {
          this.popupRemove.closeModal();
          this.toastService.success(
            'Giocatore rimosso',
            'Il giocatore ' + this.fantasyRosterSelected.roster.player.name + ' è stato rimosso correttamente'
          );
          this.fantasyRosterSelected = null;
        }),
        switchMapTo(this.rosterService.freePlayers(1, this.limit)),
        tap((rosterList: RosterList) => {
          this.rosters = rosterList.content;
        }),
        switchMapTo(this.store.select(leagueInfo)),
        take(1),
        switchMapTo(this.fantasyTeamService.draftBoard(true)),
        tap((fantasyTeams: FantasyTeam[]) => {
          this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
          for (const ft of this.fantasyTeams) {
            ft.fantasyRosters = [...ft.fantasyRosters].sort(sortFantasyRoster);
          }
        })
      )
      .subscribe(noop);
  }

  private resetForm() {
    this.form.patchValue({
      fantasyTeam: null,
      status: null,
      draft: false,
      contract: 1,
      yearContract: 1,
    });
    this.form.markAsPristine();
  }
}