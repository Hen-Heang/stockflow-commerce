// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getStorage} from 'firebase/storage'

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAZf139ypn0aoTTSlEfl7OLhoAWt2ia5-Y",
//   authDomain: "wm-file-upload.firebaseapp.com",
//   projectId: "wm-file-upload",
//   storageBucket: "wm-file-upload.appspot.com",
//   messagingSenderId: "828892156329",
//   appId: "1:828892156329:web:50b8c7d75d08881f19f4b8"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZf139ypn0aoTTSlEfl7OLhoAWt2ia5-Y",
  authDomain: "wm-file-upload.firebaseapp.com",
  projectId: "wm-file-upload",
  storageBucket: "wm-file-upload.appspot.com",
  messagingSenderId: "828892156329",
  appId: "1:828892156329:web:50b8c7d75d08881f19f4b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storageFirebase = getStorage(app);

export { storageFirebase };
// export const storage = getStorage(app)