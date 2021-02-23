import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopEntranceComponent } from '@src/app/shop/shop-entrance/shop-entrance.component';

describe('ShopEntranceComponent', () => {
  let component: ShopEntranceComponent;
  let fixture: ComponentFixture<ShopEntranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopEntranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopEntranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
