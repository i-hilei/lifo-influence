// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    showBetaFeature: false,
    apiUrl: 'http://localhost:8080',
    discoverApiUrl: 'https://discover-test.lifo.ai',
    firebase: {
        apiKey: 'AIzaSyDUBT_LoUy-yZSbGkODOexwxN5jJgwaMw4',
        authDomain: 'influencer-272204.firebaseapp.com',
        databaseURL: 'https://influencer-272204.firebaseio.com',
        projectId: 'influencer-272204',
        storageBucket: 'influencer-272204.appspot.com',
        messagingSenderId: '65044462485',
        appId: '1:65044462485:web:04b7c9263f4cd45ec2549c',
        measurementId: 'G-X25NVBSCPH',
    },
    paypal: {
        clientId: 'AfLEm5JQqRi9occz893hia2fh5FOguHxHEMXrDJwE5NY-9rMjnr-u5DHJ478dxdFLrJmrCz0lgoHDhcU',
        clientSecret: 'EFT80NQcHxIe3JImzmMcA7egwnwMRmuxL-FRQuCDV0rQI4tPNxTSD2B_eEbnw0pcs_7pjwECjSkKJcr-',
        apiUrl: 'https://api.sandbox.paypal.com',
        websiteUrl: 'https://www.sandbox.paypal.com',
    },
    host: 'http://localhost:4201',
    shopHost: 'http://localhost:4201/shop',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
