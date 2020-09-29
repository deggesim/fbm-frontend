import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupConfermaComponent } from './popup-conferma.component';

describe('PopupConfermaComponent', () => {
  let component: PopupConfermaComponent;
  let fixture: ComponentFixture<PopupConfermaComponent>;

  beforeEach(async(() => {
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
