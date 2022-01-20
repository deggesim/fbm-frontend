import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/user/services/user.service';
import { Role, User } from '@app/models/user';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { ToastService } from '@app/shared/services/toast.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[];

  userSelected: User;
  mostraPopupModifica: boolean;
  titoloModale: string;

  isSuperAdmin$ = this.userService.isSuperAdmin$();
  Role = Role;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfirmComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfirmComponent;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
  }

  nuovo() {
    this.userSelected = undefined;
    this.mostraPopupModifica = true;
    this.titoloModale = 'Nuovo utente';
  }

  modifica(user: User): void {
    const { _id, name, email, password, role } = user;
    this.userSelected = { _id, name, email, password, role };
    this.mostraPopupModifica = true;
    this.titoloModale = 'Modifica utente';
  }

  salva(user: User) {
    if (user._id == null) {
      this.userService
        .create(user)
        .pipe(
          tap(() => {
            this.mostraPopupModifica = false;
            this.toastService.success('Nuovo utente', 'Nuovo utente inserito correttamente');
            this.userSelected = undefined;
          }),
          switchMap(() => this.userService.read())
        )
        .subscribe((users: User[]) => {
          this.users = users;
        });
    } else {
      this.userService
        .update(user)
        .pipe(
          tap(() => {
            this.mostraPopupModifica = false;
            this.toastService.success('Modifica utente', 'Utente modificato correttamente');
            this.userSelected = undefined;
          }),
          switchMap(() => this.userService.read())
        )
        .subscribe((users: User[]) => {
          this.users = users;
        });
    }
  }

  annulla(): void {
    this.mostraPopupModifica = false;
  }

  apriPopupElimina(user: User) {
    this.userSelected = user;
    this.popupConfermaElimina.openModal();
  }

  confermaElimina() {
    if (this.userSelected) {
      this.userService
        .delete(this.userSelected._id)
        .pipe(
          tap(() => {
            this.popupConfermaElimina.closeModal();
            this.toastService.success('Utente eliminato', "L'utente è stato eliminato correttamente");
            this.userSelected = undefined;
          }),
          switchMap(() => this.userService.read())
        )
        .subscribe((users: User[]) => {
          this.users = users;
        });
    }
  }

  apriPopupUpload() {
    this.popupUpload.openModal();
  }

  confermaUpload(file: File) {
    this.userService
      .upload(file)
      .pipe(
        switchMap(() => {
          return this.userService.read();
        })
      )
      .subscribe((users: User[]) => {
        this.users = users;
        this.popupUpload.closeModal();
      });
  }
}
