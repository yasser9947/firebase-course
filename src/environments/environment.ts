// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators:true,
  firebase: {
    apiKey: 'AIzaSyCE42aJs05BXypwNloa2f-VOqLVRfZq5oc',
    authDomain: 'swift-habitat-384304.firebaseapp.com',
    projectId: 'swift-habitat-384304',
    storageBucket: "dazzling-kite-242522.appspot.com",
    messagingSenderId: '797091519006',
    appId: '1:797091519006:web:4a9c70fae8309032d76c0f',
    measurementId: 'G-PE3W0L8YJP'
  },
  api: {

  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
