import pkg from '../../package.json';

export const environment = {
  production: true,
  version: pkg.version,
  environment: 'prod',
  firebaseConfig: {
    apiKey: 'AIzaSyAFCOArVLBjPWknMpW7moY64agxXBfIDeg',
    authDomain: 'algarve-99b2b.firebaseapp.com',
    databaseURL: 'https://algarve-99b2b.firebaseio.com',
    projectId: 'algarve-99b2b',
    storageBucket: 'algarve-99b2b.appspot.com',
    messagingSenderId: '554688316104',
  },
  sentry: {
    DSN: 'https://8eef06c677f449be84d411fa86f5b3f0@sentry.io/1280696',
  },
  maxDiasCancelaReserva: 1,
};
