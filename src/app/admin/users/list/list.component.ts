import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { toastType } from '@app/shared/globals';
import { PopupConfermaComponent } from '@app/shared/popup-conferma/popup-conferma.component';
import { SharedService } from '@app/shared/shared.service';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users: User[];

  userSelected: User;
  mostraPopupModifica: boolean;
  titoloModale: string;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfermaComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfermaComponent;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    console.log('init ListComponent');
    this.route.data.subscribe(
      (data) => {
        this.users = data.users;
      }
    );
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
      this.userService.create(user).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Nuovo utente';
          const message = 'Nuovo utente inserito correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.userSelected = undefined;
        }),
        switchMap(() => this.userService.read())
      ).subscribe((users: User[]) => {
        this.users = users;
      });
    } else {
      this.userService.update(user).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.mostraPopupModifica = false;
          const title = 'Modifica utente';
          const message = 'Utente modificato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.userSelected = undefined;
        }),
        switchMap(() => this.userService.read())
      ).subscribe((users: User[]) => {
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
      this.userService.delete(this.userSelected._id).pipe(
        catchError((err) => {
          this.sharedService.notifyError(err);
          return EMPTY;
        }),
        tap(() => {
          this.popupConfermaElimina.chiudiModale();
          const title = 'Utente eliminato';
          const message = 'L\'utente è stato eliminato correttamente';
          this.sharedService.notifica(toastType.success, title, message);
          this.userSelected = undefined;
        }),
        switchMap(() => this.userService.read()),
      ).subscribe((users: User[]) => {
        this.users = users;
      });
    }
  }

  apriPopupUpload() {
    this.popupUpload.apriModale();
  }

  confermaUpload(file: File) {
    this.userService.upload(file).pipe(
      catchError((err) => {
        this.sharedService.notifyError(err);
        return EMPTY;
      }),
      switchMap(() => {
        return this.userService.read();
      }),
    ).subscribe((users: User[]) => {
      this.users = users;
      this.popupUpload.chiudiModale();
    });
  }


}
