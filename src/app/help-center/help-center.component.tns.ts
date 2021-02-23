import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampaignService } from '@services/campaign.service';

@Component({
    selector: 'app-help-center',
    templateUrl: './help-center.component.tns.html',
    styleUrls: ['./help-center.component.tns.scss'],
})
export class HelpCenterComponent implements OnInit {
    selectedCategory = 'Campaign';
    radioData = [
        {
            name: 'Campaign',
            value: 'Campaign',
            checked: true,
        },
        {
            name: 'Commission',
            value: 'Commission',
            checked: false,
        },
    ];
    faqList = [];
    storedFaqList: { [key: string]: any[] } = {};
    expandedQuestion: string;

    constructor(public campaignService: CampaignService) {}

    ngOnInit() {
        this.getFaqAlls(this.selectedCategory);
    }

    selectCategory(key: string) {
        this.selectedCategory = key;
        if (this.storedFaqList[key]) {
            this.faqList = this.storedFaqList[key];
        } else {
            this.getFaqAlls(key);
        }
    }

    toggleExpandStatus(question: string) {
        console.log(question);
        if (this.expandedQuestion === question) {
            this.expandedQuestion = null;
        } else {
            this.expandedQuestion = question;
        }
        console.log(this.expandedQuestion);
    }

    async getFaqAlls(key) {
        this.faqList = [];
        const user = await this.campaignService.getFaqAll();
        user.subscribe((result) => {
            console.log(result);
            const arr = [];

            for (const item of result) {
                if (item.category === key) {
                    arr.push(item);
                }
            }

            this.faqList = arr;
            this.storedFaqList[key] = arr;
        });
    }
}
