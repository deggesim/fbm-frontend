import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { itLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { toastType } from '@app/shared/constants/globals';

@Injectable()
export class SharedService {

  private bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false,
    dateInputFormat: 'DD/MM/YYYY'
  };

  constructor(
    private localeService: BsLocaleService,
    private toastr: ToastrService,
  ) {
    defineLocale('it', itLocale);
    this.localeService.use('it');
  }

  public getBsConfig(): Partial<BsDatepickerConfig> {
    return this.bsConfig;
  }

  public notifica(type: string, title: string, message: string) {
    this.toastr[type](message, title);
  }

  notifyError(response: HttpErrorResponse) {
    let titolo = '';
    let descrizione = '';
    console.error(response);

    if (response != null) {
      switch (response.status) {
        case 400:
          titolo = 'Errore nella richiesta';
          descrizione = response.error || response.message || 'I dati inseriti sono errati';
          break;
        case 401:
          titolo = 'Utente non loggato';
          descrizione = 'L\'utente non è loggato o la sessione è scaduta';
          break;
        case 403:
          titolo = 'Utente non autorizzato';
          descrizione = 'L\'utente non è autorizzato ad eseguire l\'operazione richiesta';
          break;
        case 422:
          titolo = 'Errore nella richiesta';
          descrizione = response.error || response.message;
          break;
        case 500:
          titolo = 'Errore server';
          descrizione = 'Si è verificato un errore imprevisto';
          break;
        default:
          titolo = 'Problema generico';
          descrizione = 'Si è verificato un errore imprevisto';
          break;
      }
    }
    this.notifica(toastType.error, titolo, descrizione);
  }

  notifyErrorDownload(response: Response) {
    let titolo;
    let descrizione = '';
    const tipoOperazione = 'alert';
    titolo = 'Errore server';
    descrizione = 'Si è verificato un problema nel download del documento';
    this.notifica(toastType.error, titolo, descrizione);
  }
}