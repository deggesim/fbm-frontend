import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FantasyTeam } from 'src/app/models/fantasy-team';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-fantasy-team-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input() fantasyTeam: FantasyTeam;
  @Output() salva: EventEmitter<any> = new EventEmitter(true);
  @Output() annulla: EventEmitter<any> = new EventEmitter(true);

  form: FormGroup;

  users: User[];
  usersLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('EditComponent');
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
        owners
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
        owners
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
      owners: [undefined, this.checkLength()],
    });
  }

  checkLength(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.form && this.form.value.owners) {
        const wrongValue = control.value.length < 1;
        return wrongValue ? { wrongLength: { value: control.value.length } } : null;
      }
    };
  }

  save(): void {
    const {
      name,
      initialBalance,
      outgo,
      totalContracts,
      playersInRoster,
      extraPlayers,
      pointsPenalty,
      balancePenalty,
      owners
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
      owners
    };
    this.salva.emit(fantasyTeam);
  }

  trackUserByFn(user: User) {
    return user._id;
  }

}
