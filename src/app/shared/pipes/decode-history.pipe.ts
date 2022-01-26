import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHistory',
})
export class DecodeHistoryPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    // 'DRAFT', 'BUY', 'UPDATE', 'REMOVE', 'RELEASE', 'TRADE_OUT', 'TRADE_IN', 'UPDATE_BALANCE'
    let decodedValue = '';
    switch (value) {
      case 'DRAFT':
        decodedValue = 'Giocatore scelto al draft';
        break;
      case 'BUY':
        decodedValue = 'Giocatore acquistato al mercato libero';
        break;
      case 'UPDATE':
        decodedValue = 'Giocatore modificato';
        break;
      case 'REMOVE':
        decodedValue = 'Giocatore rimosso';
        break;
      case 'RELEASE':
        decodedValue = 'Giocatore rilasciato';
        break;
      case 'TRADE_OUT':
        decodedValue = "Giocatore ceduto ad un'altra squadra";
        break;
      case 'TRADE_IN':
        decodedValue = "Giocatore acquistato da un'altra squadra";
        break;
      case 'UPDATE_BALANCE':
        decodedValue = 'Modifica bilancio fantasquadra';
        break;

      default:
        break;
    }
    return decodedValue;
  }
}
