import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignListItemNewComponent } from './campaign-list-item-new.component';

describe('LotteryComponent', () => {
  let component: CampaignListItemNewComponent;
  let fixture: ComponentFixture<CampaignListItemNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignListItemNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignListItemNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
