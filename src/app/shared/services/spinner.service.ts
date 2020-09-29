import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {

  // contatore di richieste in attesa di completamento
  private loading = 0;

  constructor() { }

  public start() {
    this.loading++;
    // console.log(`start -> loading = ${this.loading}`);
  }

  public end() {
    this.loading--;
    // console.log(`end -> loading = ${this.loading}`);
  }

  public isLoading() {
    // console.log(`isLoading -> loading = ${this.loading}`);
    return this.loading > 0;
  }

}
