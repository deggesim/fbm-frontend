import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as globals from '../shared/globals';
import { SharedService } from '../shared/shared.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mostraPopup: boolean;
  titoloModale: string;

  constructor(
    private route: Router,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    console.log('init HomeComponent');
  }

}
