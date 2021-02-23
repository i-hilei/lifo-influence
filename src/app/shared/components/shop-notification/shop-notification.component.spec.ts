import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopNotificationComponent } from '@src/app/shared/components/shop-notification/shop-notification.component';

describe('ShopNotificationComponent', () => {
  let component: ShopNotificationComponent;
  let fixture: ComponentFixture<ShopNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
