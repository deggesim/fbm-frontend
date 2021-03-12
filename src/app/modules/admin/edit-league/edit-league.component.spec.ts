import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLeagueComponent } from './edit-league.component';

describe('EditLeagueComponent', () => {
  let component: EditLeagueComponent;
  let fixture: ComponentFixture<EditLeagueComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditLeagueComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
