import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/user/services/user.service';
import { Role, User } from '@app/models/user';
import { PopupConfirmComponent } from '@app/shared/components/popup-confirm/popup-confirm.component';
import { ToastService } from '@app/shared/services/toast.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'fbm-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[];

  userSelected: User;
  titoloModale: string;

  isSuperAdmin$ = this.userService.isSuperAdmin$();
  Role = Role;

  @ViewChild('popupConfermaElimina', { static: false }) public popupConfermaElimina: PopupConfirmComponent;
  @ViewChild('popupUpload', { static: false }) public popupUpload: PopupConfirmComponent;
  @ViewChild('modalUserForm', { static: false }) modalUserForm: ModalDirective;
  showModalUserForm: boolean;

  constructor(private route: ActivatedRoute, private toastService: ToastService, private userService: UserService) {}

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
  }

  nuovo() {
    this.userSelected = undefined;
    this.showModalUserForm = true;
    this.titoloModale = 'Nuovo utente';
  }

  update(user: User): void {
    const { _id, name, email, password, role } = user;
    this.userSelected = { _id, name, email, password, role };
    this.showModalUserForm = true;
    this.titoloModale = 'Modifica utente';
  }

  save(user: User) {
    if (user._id == null) {
      this.userService
        .create(user)
        .pipe(
          tap(() => {
            this.hideModal();
          }),
          switchMap(() => this.userService.read()),
          map((users: User[]) => [...users].sort((a, b) => a.email.localeCompare(b.email)))
        )
        .subscribe((users: User[]) => {
          this.users = users;
          this.userSelected = undefined;
          this.toastService.success('Nuovo utente', 'Nuovo utente inserito correttamente');
        });
    } else {
      this.userService
        .update(user)
        .pipe(
          tap(() => {
            this.hideModal();
          }),
          switchMap(() => this.userService.read()),
          map((users: User[]) => [...users].sort((a, b) => a.email.localeCompare(b.email)))
        )
        .subscribe((users: User[]) => {
          this.users = users;
          this.userSelected = undefined;
          this.toastService.success('Modifica utente', 'Utente modificato correttamente');
        });
    }
  }

  hideModal(): void {
    this.modalUserForm?.hide();
  }

  onHidden(): void {
    this.showModalUserForm = false;
  }

  openDeletePopup(user: User) {
    this.userSelected = user;
    this.popupConfermaElimina.openModal();
  }

  confirmDelete() {
    if (this.userSelected) {
      this.userService
        .delete(this.userSelected._id)
        .pipe(
          tap(() => {
            this.popupConfermaElimina.closeModal();
            this.toastService.success('Utente eliminato', "L'utente è stato eliminato correttamente");
            this.userSelected = undefined;
          }),
          switchMap(() => this.userService.read()),
          map((users: User[]) => [...users].sort((a, b) => a.email.localeCompare(b.email)))
        )
        .subscribe((users: User[]) => {
          this.users = users;
        });
    }
  }

  openUploadPopup() {
    this.popupUpload.openModal();
  }

  confirmUpload(file: File) {
    this.userService
      .upload(file)
      .pipe(
        switchMap(() => this.userService.read()),
        map((users: User[]) => [...users].sort((a, b) => a.email.localeCompare(b.email)))
      )
      .subscribe((users: User[]) => {
        this.users = users;
        this.popupUpload.closeModal();
      });
  }
}
