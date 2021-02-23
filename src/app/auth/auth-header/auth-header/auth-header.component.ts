import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@src/app/native-helper/router-helper/router';

@Component({
    selector: 'app-auth-header',
    templateUrl: './auth-header.component.html',
    styleUrls: ['./auth-header.component.scss'],
})
export class AuthHeaderComponent implements OnInit {
    @Input() rightLink: string;
    @Input() leftText: string;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    goPage() {
        if (this.rightLink) {
            this.router.navigate([this.rightLink], { queryParamsHandling: 'preserve' });
        }
    }
}
