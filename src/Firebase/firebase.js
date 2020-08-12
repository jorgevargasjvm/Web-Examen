import firebase from "firebase"
import { func } from "prop-types";
const app = {
    apiKey: "AIzaSyCP3-FtIFxG2lVMplKYhD0HrTS8PYWQwnw",
    authDomain: "webfinal-acb91.firebaseapp.com",
    databaseURL: "https://webfinal-acb91.firebaseio.com",
    projectId: "webfinal-acb91",
    storageBucket: "webfinal-acb91.appspot.com",
    messagingSenderId: "147666120185",
    appId: "1:147666120185:web:f67741675bec3dd073a128",
    measurementId: "G-9GP1KEWYDS"
};;
  // Initialize Firebase
//   console.log(firebase)
  firebase.initializeApp(app);
  const db = firebase.firestore();
//   firebase.analytics()
function userLogin(email , password){
    console.log("aaaaaa")
    return firebase.auth().signInWithEmailAndPassword(email , password)
}
function userLogOut(){
    return firebase.auth().signOut()
}

function createContact(firstName , lastName , email , phone){
  return db.collection('contacts').add({
    firstName,
    lastName,
    email,
    phone
  })
}

// function getContacts(){
  
// }

export {
    userLogin,
    userLogOut,
    db,
    createContact,
    firebase as default
}
// export default firebase;
