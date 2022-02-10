// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import pkg from '../../package.json';

export const environment = {
  version: pkg.version,
  production: false,
  environment: 'dev',
  // firebaseConfig: {
  //   apiKey: 'AIzaSyBanfAwlFcI274vjgrEsRFri8S46fkpdEo',
  //   authDomain: 'algarve-dev.firebaseapp.com',
  //   databaseURL: 'https://algarve-dev.firebaseio.com',
  //   projectId: 'algarve-dev',
  //   storageBucket: 'algarve-dev.appspot.com',
  //   messagingSenderId: '704813360883',
  // },
  firebaseConfig: {
    apiKey: 'AIzaSyAFCOArVLBjPWknMpW7moY64agxXBfIDeg',
    authDomain: 'algarve-99b2b.firebaseapp.com',
    databaseURL: 'https://algarve-99b2b.firebaseio.com',
    projectId: 'algarve-99b2b',
    storageBucket: 'algarve-99b2b.appspot.com',
    messagingSenderId: '554688316104',
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
