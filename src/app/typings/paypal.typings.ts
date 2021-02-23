
export interface IPaypalAuthTokenResponse {
    access_token: string;
    expires_in: number;
    nonce: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface IPaypalCustomerInfo {
    user_id: string;
    name: string;
    given_name: string;
    family_name: string;
    payer_id: string;
    address: IPaypalCustomerAddress;
    verified_account: string;
    emails: IPaypalCustomerEmail[];
}

export interface IPaypalCustomerAddress {
    street_address: string;
    locality: string;
    region: string;
    postal_code: string;
    country: string;
}

export interface IPaypalCustomerEmail {
    value: string;
    primary: true;
}
