import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryRedirectComponent } from '@src/app/auth/lottery-redirect/lottery-redirect.component';

describe('LotteryRedirectComponent', () => {
  let component: LotteryRedirectComponent;
  let fixture: ComponentFixture<LotteryRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteryRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
