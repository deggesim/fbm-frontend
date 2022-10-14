import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  form = this.fb.group({
    name: [null as string, Validators.required],
    initialBalance: [null as number, [Validators.required, Validators.min(0)]],
    outgo: [null as number, [Validators.required, Validators.min(0)]],
    totalContracts: [null as number, [Validators.required, Validators.min(0)]],
    playersInRoster: [null as number, [Validators.required, Validators.min(0)]],
    extraPlayers: [null as number, [Validators.required, Validators.min(0)]],
    pointsPenalty: [null as number, [Validators.required, Validators.min(0)]],
    balancePenalty: [null as number, [Validators.required, Validators.min(0)]],
    owners: [null as User[], atLeastOne],
  });

  users: User[];

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

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
