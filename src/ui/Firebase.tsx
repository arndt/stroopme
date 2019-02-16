import * as firebase from 'firebase/app';

const config = {
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export default firebase;
