import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/user/services/user.service';
import { User } from '@app/models/user';
import { PopupConfermaComponent } from '@app/shared/components/popup-conferma/popup-conferma.component';
import { ToastService } from '@app/shared/services/toast.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[];

  userSelected: User;
  mostraPopupModifica: boolean;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfermaComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfermaComponent;

  constructor(private route: ActivatedRoute, private toastService: ToastService, private userService: UserService) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.users = data.users;
    });
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
            const title = 'Nuovo utente';
            const message = 'Nuovo utente inserito correttamente';
            this.toastService.success(title, message);
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
            const title = 'Modifica utente';
            const message = 'Utente modificato correttamente';
            this.toastService.success(title, message);
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
    this.popupConfermaElimina.apriModale();
  }

  confermaElimina() {
    if (this.userSelected) {
      this.userService
        .delete(this.userSelected._id)
        .pipe(
          tap(() => {
            this.popupConfermaElimina.chiudiModale();
            const title = 'Utente eliminato';
            const message = "L'utente è stato eliminato correttamente";
            this.toastService.success(title, message);
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
    this.popupUpload.apriModale();
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
        this.popupUpload.chiudiModale();
      });
  }
}
