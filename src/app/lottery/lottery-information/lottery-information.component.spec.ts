import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryInformationComponent } from './lottery-information.component';

describe('LotteryInformationComponent', () => {
  let component: LotteryInformationComponent;
  let fixture: ComponentFixture<LotteryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteryInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
