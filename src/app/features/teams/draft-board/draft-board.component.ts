import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { leagueInfo } from '@app/core/league/store/league.selector';
import { FantasyRoster, sortFantasyRoster } from '@app/models/fantasy-roster';
import { FantasyTeam } from '@app/models/fantasy-team';
import { Roster, RosterList } from '@app/models/roster';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { FantasyRosterService } from '@app/shared/services/fantasy-roster.service';
import { FantasyTeamService } from '@app/shared/services/fantasy-team.service';
import { RosterService } from '@app/shared/services/roster.service';
import { ToastService } from '@app/shared/services/toast.service';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged, iif, noop, of, Subject, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'fbm-draft-board',
  templateUrl: './draft-board.component.html',
})
export class DraftBoardComponent implements OnInit {
  form = this.fb.group({
    fantasyTeam: [null as FantasyTeam, Validators.required],
    roster: [null as Roster],
    status: [null as string, Validators.required],
    draft: [null as boolean, Validators.required],
    contract: [1, Validators.required],
    yearContract: [1, Validators.required],
  });

  fantasyTeams: FantasyTeam[];
  rosters: Roster[];
  rosterSelected: Roster;
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
          switchMap(() => this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMap(() => this.store.select(leagueInfo)),
          take(1),
          switchMap(() => this.fantasyTeamService.draftBoard(true)),
          tap((fantasyTeams: FantasyTeam[]) => {
            this.fantasyTeams = [...fantasyTeams].sort((a, b) => a.name.localeCompare(b.name));
            for (const ft of this.fantasyTeams) {
              ft.fantasyRosters = [...ft.fantasyRosters].sort(sortFantasyRoster);
            }
          })
        )
        .subscribe(noop);
    } else {
      const fantasyRoster = { ...this.form.value };
      this.fantasyRosterService
        .create(fantasyRoster as FantasyRoster)
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
          switchMap(() => this.rosterService.freePlayers(1, this.limit)),
          tap((rosterList: RosterList) => {
            this.rosters = rosterList.content;
          }),
          switchMap(() => this.store.select(leagueInfo)),
          take(1),
          switchMap(() => this.fantasyTeamService.draftBoard(true)),
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

  update(event: { fantasyTeam: FantasyTeam; fantasyRoster: FantasyRoster }) {
    const { fantasyTeam, fantasyRoster } = event;
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
        switchMap(() => this.rosterService.freePlayers(1, this.limit)),
        tap((rosterList: RosterList) => {
          this.rosters = rosterList.content;
        }),
        switchMap(() => this.store.select(leagueInfo)),
        take(1),
        switchMap(() => this.fantasyTeamService.draftBoard(true)),
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
