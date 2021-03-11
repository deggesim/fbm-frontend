import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PopupConfermaComponent } from './popup-conferma.component';

describe('PopupConfermaComponent', () => {
  let component: PopupConfermaComponent;
  let fixture: ComponentFixture<PopupConfermaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupConfermaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupConfermaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
