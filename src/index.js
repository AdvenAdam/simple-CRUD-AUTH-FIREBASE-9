import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc
} from 'firebase/firestore';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBt0LPvvZ0x1pRvwnxeCc8EHyiL2gAnGd0',
    authDomain: 'fir-9-train.firebaseapp.com',
    projectId: 'fir-9-train',
    storageBucket: 'fir-9-train.appspot.com',
    messagingSenderId: '235545458616',
    appId: '1:235545458616:web:b8ae6b75181ddd41a7014d',
    measurementId: 'G-MQPTLNVT18'
};
// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection reff
const colRef = collection(db, 'books');

// queries filtering data
// const q = query(colRef, where('author', '==', 'Bonyti'), orderBy('title', 'desc'));

const q = query(colRef, orderBy('createdAt'));

// realtime collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
});

// adding docs
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    }).then(() => {
        addBookForm.reset();
    });
});

// deleting docs
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', deleteBookForm.id.value);

    deleteDoc(docRef).then(() => {
        deleteBookForm.reset();
    });
});

// get single doc
const docRef = doc(db, 'books', 'SRbxBbLjJ8xbh6sZeixh');

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
});

// updating docs

const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const docRef = doc(db, 'books', updateBookForm.id.value);
    // updated title replace with value, grab it from a form using DOM
    updateDoc(docRef, {
        title: 'updated title'
    }).then(() => {
        updateBookForm.reset();
    });
});
// signing users up
const signUpForm = document.querySelector('.signup');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('User Created :', cred.user);
            signUpForm.reset();
        })
        .catch((err) => {
            console.log(err.message);
        });
});
// logging logout
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth)
        .then(() => {
            // console.log('User Logout');
        })
        .catch((err) => {
            console.log(err.message);
        });
});
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log('User In :', cred);
        })
        .catch((err) => {
            console.log(err.message);
        });
});
// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed :', user);
});

// unsubscribe from db/auth changes
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Unsubscribing');
    unsubCol();
    unsubDoc();
    unsubAuth();
});

// ====================================NOTE=========================================
// get collection data (with reload)
// getDocs(colRef)
//     .then((snapshot) => {
//         let books = [];
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id });
//         });
//         console.log(books);
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });
