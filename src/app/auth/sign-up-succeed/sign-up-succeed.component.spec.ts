import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignUpSucceedComponent} from './sign-up-succeed.component';

describe('SignUpSucceedComponent', () => {
    let component: SignUpSucceedComponent;
    let fixture: ComponentFixture<SignUpSucceedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignUpSucceedComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignUpSucceedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
