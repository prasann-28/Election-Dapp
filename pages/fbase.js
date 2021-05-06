import firebase from 'firebase'

const config={
    apiKey: "AIzaSyB87noD2rauil9yHJlXVoBnEHkJtN1H7Bk",
    authDomain: "reactotp-9d06d.firebaseapp.com",
    projectId: "reactotp-9d06d",
    storageBucket: "reactotp-9d06d.appspot.com",
    messagingSenderId: "409884613297",
    appId: "1:409884613297:web:236d420c45c00fe7a1e090"
}
if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
export default firebase
