import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSeasonStepTwoComponent } from './new-season-step-two.component';

describe('NewSeasonStepTwoComponent', () => {
  let component: NewSeasonStepTwoComponent;
  let fixture: ComponentFixture<NewSeasonStepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSeasonStepTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSeasonStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
