import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserRoleIconComponent } from './user-role-icon.component';

describe('UserRoleIconComponent', () => {
  let component: UserRoleIconComponent;
  let fixture: ComponentFixture<UserRoleIconComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserRoleIconComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
