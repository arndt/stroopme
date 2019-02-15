import * as firebase from 'firebase/app';
import 'firebase/database';

var config = {

};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export default firebase;
