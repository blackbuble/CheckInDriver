import firebase from 'firebase'
import 'firebase/firestore'

import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
	MESSAGE_SENDER_ID,
    APP_ID
} from 'react-native-dotenv'

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
	/* apiKey: "AIzaSyCB86N_UsZ5DaFCllFTVLYBSUV9D5R6z2c",
	authDomain: "check-in-7a100.firebaseapp.com",
	databaseURL: "https://check-in-7a100.firebaseio.com",
	projectId: "check-in-7a100",
	storageBucket: "check-in-7a100.appspot.com",
	messagingSenderId: "760554833861",
	appId: "1:760554833861:web:e9c3993f91910aee78edac" */
}

// Initialize Firebase
//let Firebase = firebase.initializeApp(firebaseConfig)
const Firebase = firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

//export const message = firebase.messaging()

// avoid deprecated warnings
/* db.settings({
    timestampsInSnapshots: true
}) */

export default Firebase;