import { Injectable } from '@angular/core';
import {RequestService} from '@services/request.service';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(
      private requestService: RequestService
  ) {
  }

  getVerificationCode(phone_number: string) {
      return this.requestService.sendRequest({
          method: 'POST',
          url: '/shared/send_verification_code',
          data: {
              phone_number
          },
          api: 'data-shop'
      });
  }

  getValidateCode(phone_number: string, code: string) {
      return this.requestService.sendRequest({
          method: 'POST',
          url: '/shared/validate_code',
          data: {
              phone_number,
              code
          },
          api: 'data-shop'
      });
  }
}
