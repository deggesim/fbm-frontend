import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpinnerService } from './shared/spinner.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {

  faSpinner = faSpinner

  // Sets initial value to true to show loading spinner on first load
  loading = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    public spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    console.log('ngOnInit AppComponent');
  }

  ngAfterViewChecked(): void {
    this.loading = this.spinnerService.isLoading();
    this.cdRef.detectChanges();
  }

}
