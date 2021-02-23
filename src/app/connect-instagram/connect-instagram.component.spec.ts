import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConnectInstagramComponent} from './connect-instagram.component';

describe('ConnectInstagramComponent', () => {
    let component: ConnectInstagramComponent;
    let fixture: ComponentFixture<ConnectInstagramComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConnectInstagramComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectInstagramComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
