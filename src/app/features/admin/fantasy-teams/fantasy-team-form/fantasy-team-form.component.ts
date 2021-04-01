import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FantasyTeam } from '@app/models/fantasy-team';
import { User } from '@app/models/user';
import { UserService } from '@app/shared/services/user.service';
import { atLeastOne } from '@app/shared/util/validations';

@Component({
  selector: 'app-fantasy-team-form',
  templateUrl: './fantasy-team-form.component.html',
})
export class FantasyTeamFormComponent implements OnInit, OnChanges {
  @Input() fantasyTeam: FantasyTeam;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  users: User[];
  usersLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.createForm();
  }

  ngOnInit() {
    this.usersLoading = true;
    this.userService.read().subscribe((users: User[]) => {
      this.users = users;
      this.usersLoading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const fantasyTeam: FantasyTeam = changes.fantasyTeam.currentValue;
    if (fantasyTeam != null) {
      const {
        name,
        initialBalance,
        outgo,
        totalContracts,
        playersInRoster,
        extraPlayers,
        pointsPenalty,
        balancePenalty,
        owners,
      } = fantasyTeam;
      this.form.patchValue({
        name,
        initialBalance,
        outgo,
        totalContracts,
        playersInRoster,
        extraPlayers,
        pointsPenalty,
        balancePenalty,
        owners,
      });
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [undefined, Validators.required],
      initialBalance: [undefined, [Validators.required, Validators.min(0)]],
      outgo: [undefined, [Validators.required, Validators.min(0)]],
      totalContracts: [undefined, [Validators.required, Validators.min(0)]],
      playersInRoster: [undefined, [Validators.required, Validators.min(0)]],
      extraPlayers: [undefined, [Validators.required, Validators.min(0)]],
      pointsPenalty: [undefined, [Validators.required, Validators.min(0)]],
      balancePenalty: [undefined, [Validators.required, Validators.min(0)]],
      owners: [undefined, atLeastOne],
    });
  }

  salvaEvent(): void {
    const {
      name,
      initialBalance,
      outgo,
      totalContracts,
      playersInRoster,
      extraPlayers,
      pointsPenalty,
      balancePenalty,
      owners,
    } = this.form.value;
    const fantasyTeam: FantasyTeam = {
      _id: this.fantasyTeam ? this.fantasyTeam._id : null,
      name,
      initialBalance,
      outgo,
      totalContracts,
      playersInRoster,
      extraPlayers,
      pointsPenalty,
      balancePenalty,
      owners,
    };
    this.salva.emit(fantasyTeam);
  }

  trackUserByFn(user: User) {
    return user._id;
  }
}
