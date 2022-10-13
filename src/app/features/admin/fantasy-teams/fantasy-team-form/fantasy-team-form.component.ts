import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/user/services/user.service';
import { FantasyTeam } from '@app/models/fantasy-team';
import { User } from '@app/models/user';
import { atLeastOne } from '@app/shared/util/validations';

@Component({
  selector: 'fbm-fantasy-team-form',
  templateUrl: './fantasy-team-form.component.html',
})
export class FantasyTeamFormComponent implements OnInit, OnChanges {
  @Input() fantasyTeam: FantasyTeam;
  @Output() save: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  form: UntypedFormGroup;

  users: User[];

  constructor(private fb: UntypedFormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const fantasyTeam: FantasyTeam = changes['fantasyTeam'].currentValue;
    if (fantasyTeam != null) {
      const { name, initialBalance, outgo, totalContracts, playersInRoster, extraPlayers, pointsPenalty, balancePenalty, owners } =
        fantasyTeam;
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

  onSubmit(): void {
    const { name, initialBalance, outgo, totalContracts, playersInRoster, extraPlayers, pointsPenalty, balancePenalty, owners } =
      this.form.value;
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
    this.save.emit(fantasyTeam);
  }

  trackUserByFn(user: User) {
    return user._id;
  }
}
