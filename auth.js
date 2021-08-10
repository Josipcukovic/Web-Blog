// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDCipF0T79auO_vSF-j4JUDZOYxXk98b8o",
    authDomain: "blog-11a4b.firebaseapp.com",
    projectId: "blog-11a4b",
    storageBucket: "blog-11a4b.appspot.com",
    messagingSenderId: "412830692922",
    appId: "1:412830692922:web:355cdc9f11129eeb07a703"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
//
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(auth.currentUser.uid);
        console.log(auth.currentUser.displayName);
        // const toDoRef = db.ref(`/toDo/${auth.currentUser.uid}`);
        showElements(user);
        // toDoRef.on("child_added", showTodo);
    } else {
        showElements();
    }
});



const wrapperRegister = document.querySelector(".wrapper-register");
const wrapperLogin = document.querySelector(".wrapper-login");

const registerForm = document.querySelector(".registerForm");
const userRef = db.collection("users");
///register
registerForm.addEventListener("submit", e => {
    e.preventDefault();
    registerForm["name"].value
    const ime = registerForm["name"].value;
    const prezime = registerForm["last-name"].value;
    const email = registerForm["email"].value;
    const password = registerForm["password"].value;
    const punoIme = `${ime} ${prezime}`;

    auth.createUserWithEmailAndPassword(email, password).then(() => {
        let currentUser = auth.currentUser;
        currentUser.updateProfile({ displayName: punoIme }).catch(function (error) {
            // An error happened.
            console.log(error)
        });
        const user = {
            ime,
            prezime,
            email
        }

        userRef.doc(`${currentUser.uid}`).set(user);
        alert(currentUser.displayName);
        wrapperRegister.style.display = "none"
        registerForm.reset();

    }).catch((error) => {
        window.alert(error.message);
    });
})
///login
const loginForm = document.querySelector(".loginForm");

loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = loginForm["email"].value;
    const password = loginForm["password"].value;

    auth.signInWithEmailAndPassword(email, password).then(() => {
        wrapperLogin.style.display = "none";
        loginForm.reset();
    }).catch((error) => {
        window.alert(error.message);
    });
})


//logout
const logoutButton = document.querySelector("#logout");


logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("odlogiran si");
    auth.signOut().catch((error) => {
        window.alert(error.message);
    });
});


const logout = document.querySelector(".Logout");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const newBlog = document.querySelector(".NewBlog");
const home = document.querySelector(".home");

function showElements(user) {
    if (user) {
        // kada budes refaktorirao, idi s classlist
        if (home) {
            home.style.display = "block";
        }
        login.style.display = "none";
        register.style.display = "none";
        logout.style.display = "block";
        newBlog.style.display = "block"
    }
    else {
        logout.style.display = "none";
        login.style.display = "block";
        register.style.display = "block";
        newBlog.style.display = "none"

    }
}