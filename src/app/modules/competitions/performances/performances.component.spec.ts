import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerformancesComponent } from './performances.component';

describe('PerformancesComponent', () => {
  let component: PerformancesComponent;
  let fixture: ComponentFixture<PerformancesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
