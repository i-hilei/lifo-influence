import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptFormsModule } from '@nativescript/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { SignInComponent } from '@src/app/auth/sign-in/sign-in.component';
import { SignUpComponent } from '@src/app/auth/sign-up/sign-up.component';
import { AuthHeaderComponent } from '@src/app/auth/auth-header/auth-header/auth-header.component';
import { SignUpIndustryComponent } from '@src/app/auth/sign-up-industry/sign-up-industry.component';
import { SignUpPlatformComponent } from '@src/app/auth/sign-up-platform/sign-up-platform.component';
import { LotteryRedirectComponent } from '@src/app/auth/lottery-redirect/lottery-redirect.component';
// import { SignUpFinalComponent } from '@src/app/auth/sign-up-final/sign-up-final.component';
// import { SignUpSucceedComponent } from '@src/app/auth/sign-up-succeed/sign-up-succeed.component';
import { ForgotPasswordComponent } from '@src/app/auth/forgot-password/forgot-password.component';

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptFormsModule, NativeScriptUIDataFormModule],
    declarations: [
        SignInComponent,
        SignUpComponent,
        AuthHeaderComponent,
        SignUpIndustryComponent,
        LotteryRedirectComponent,
        SignUpPlatformComponent,
        // SignUpTiktokComponent,
        // SignUpFinalComponent,
        // SignUpSucceedComponent,
        ForgotPasswordComponent,
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AuthModule {}
