import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignUpFinalComponent} from './sign-up-final.component';

describe('SignUpFinalComponent', () => {
    let component: SignUpFinalComponent;
    let fixture: ComponentFixture<SignUpFinalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignUpFinalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignUpFinalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
