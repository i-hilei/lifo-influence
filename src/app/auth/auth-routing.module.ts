import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { GetStartedComponent } from '@auth/get-started/get-started.component';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { SignUpComponent } from '@auth/sign-up/sign-up.component';
import { LotteryRedirectComponent } from '@auth/lottery-redirect/lottery-redirect.component';
import { SignUpTiktokComponent } from '@auth/sign-up-tiktok/sign-up-tiktok.component';

const redirectAuthorizedToDashboard = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
    {
        path: '',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectAuthorizedToDashboard },
        children: [
            {
                path: 'iphone-lottery',
                component: LotteryRedirectComponent,
            },
            {
                path: 'ins',
                component: LotteryRedirectComponent,
            },
            {
                path: 'web',
                component: LotteryRedirectComponent,
            },
            {
                path: 'fb',
                component: LotteryRedirectComponent,
            },
            {
                path: 'wechat',
                component: LotteryRedirectComponent,
            },
            {
                path: 'email',
                component: LotteryRedirectComponent,
            },
            {
                path: 'get-started',
                component: GetStartedComponent,
            },
            {
                path: 'sign-in',
                component: SignInComponent,
            },
            {
                path: 'restore-password',
                component: ForgotPasswordComponent,
            },
            {
                path: 'sign-up',
                children: [
                    {
                        path: '',
                        component: SignUpComponent,
                    },
                    {
                        path: 'tik-tok',
                        component: SignUpTiktokComponent,
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
