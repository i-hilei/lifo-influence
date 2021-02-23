import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
    selector: 'app-help-center',
    templateUrl: './help-center.component.html',
    styleUrls: ['./help-center.component.scss'],
})
export class HelpCenterComponent implements OnInit {

    selectDefault = 'Campaign';
    subscription: Subscription[] = [];
    filterList = [];
    radioData = [];
    buildRadioData = true;
    faqList = [];

    constructor(
        public campaignService: CampaignService,
        public router: Router,
    ) {
    }

    ngOnInit() {
        this.getFaqAlls(this.selectDefault);
    }

    async getFaqAlls(key) {
        this.faqList = [];
        const user = await this.campaignService.getFaqAll();
        let categorySet = new Set();
        user.subscribe((result) => {
            for (const i of result) {
                if (i.category === key) {
                    this.faqList.push(i);
                }
            }
            if (this.buildRadioData) {
                for (const i of result) {
                    if (i.category && !categorySet.has(i.category)) {
                        this.radioData.push({
                            name: i.category,
                            value: i.category,
                            checked: i.category === this.selectDefault
                        });
                        categorySet.add(i.category);
                    }
                }
                this.buildRadioData = false;
            }
        });
    }

    selectClick(val) {
        for (const i of this.radioData) {
            if (i.name === val.name) {
                i.checked = true;
            } else {
                i.checked = false;
            }
        }
        this.getFaqAlls(val.name);
    }

    onChange(event) {
    }

    onLeftClick() {
        this.router.navigate(['/account-info']);
    }

}
