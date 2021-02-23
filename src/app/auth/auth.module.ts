import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { SignUpComponent } from '@auth/sign-up/sign-up.component';
import { SignUpFinalComponent } from '@auth/sign-up-final/sign-up-final.component';
import { SignUpIndustryComponent } from '@auth/sign-up-industry/sign-up-industry.component';
import { SignUpSucceedComponent } from '@auth/sign-up-succeed/sign-up-succeed.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from '@auth/auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd';
import { AuthHeaderComponent } from '@src/app/auth/auth-header/auth-header/auth-header.component';
import { SignUpPlatformComponent } from '@src/app/auth/sign-up-platform/sign-up-platform.component';
import { LotteryRedirectComponent } from '@src/app/auth/lottery-redirect/lottery-redirect.component';
import {SignUpTiktokComponent} from '@auth/sign-up-tiktok/sign-up-tiktok.component';

@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
        SignUpTiktokComponent,
        SignUpFinalComponent,
        SignUpIndustryComponent,
        SignUpSucceedComponent,
        ForgotPasswordComponent,
        AuthHeaderComponent,
        SignUpPlatformComponent,
        LotteryRedirectComponent,
    ],
    imports: [CommonModule, AuthRoutingModule, SharedModule, FormsModule, NzIconModule],
    providers: [{ provide: Window, useValue: window }],
})
export class AuthModule {}
