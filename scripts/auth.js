
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
const storageDb = firebase.storage();
const auth = firebase.auth();
const adminRef = db.collection("admins");
//
auth.onAuthStateChanged((user) => {
    if (user) {
        showElements(user);
    } else {
        showElements();
    }
});

// const registerForm = document.querySelector(".registerForm");
// const userRef = db.collection("users");
// ///register
// registerForm.addEventListener("submit", e => {
//     e.preventDefault();
//     registerForm["name"].value
//     const ime = registerForm["name"].value;
//     const prezime = registerForm["last-name"].value;
//     const email = registerForm["email"].value;
//     const password = registerForm["password"].value;
//     const punoIme = `${ime} ${prezime}`;

//     auth.createUserWithEmailAndPassword(email, password).then(() => {
//         let currentUser = auth.currentUser;
//         currentUser.updateProfile({ displayName: punoIme }).catch(function (error) {
//             // An error happened.
//             console.log(error)
//         });
//         const user = {
//             ime,
//             prezime,
//             email
//         }

//         userRef.doc(`${currentUser.uid}`).set(user);
//         wrapperRegister.style.display = "none"
//         registerForm.reset();
//         window.location.reload();
//     }).catch((error) => {
//         window.alert(error.message);
//     });
// })
// ///login
// const loginForm = document.querySelector(".loginForm");

// loginForm.addEventListener("submit", e => {
//     e.preventDefault();
//     const email = loginForm["email"].value;
//     const password = loginForm["password"].value;

//     auth.signInWithEmailAndPassword(email, password).then(() => {
//         wrapperLogin.style.display = "none";
//         loginForm.reset();
//         location.reload();
//     }).catch((error) => {
//         window.alert(error.message);
//     });
// })





let idToCheck = "";

adminRef.get().then(docs => {
    docs.forEach(admin => {
        idToCheck = admin.data();
        ///promjeni ovo ako je potrebno
        if (auth.currentUser.uid == idToCheck.id) {
            const navLinks = document.querySelector("#nav-links");
            const reportedPostsTemplate = `<li class="reportedPosts"><a href="reportedStuff.html">Reported Posts</a></li>`;
            navLinks.insertAdjacentHTML('afterbegin', reportedPostsTemplate);
        }
    })
}).catch(eror => {
    ///do nothing, just catch it
})

//logout
const logoutButton = document.querySelector("#logout");


logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().catch((error) => {
        window.alert(error.message);
    });
    window.location.href = "index.html";
});




const loggedIn = document.querySelectorAll(".loggedIn");
const loggedOut = document.querySelectorAll(".loggedOut");

function showElements(user) {

    if (user) {
        loggedIn.forEach(element => {
            element.classList.add("showElement");
        });

        loggedOut.forEach(element => {
            element.classList.add("hideElement");
        });

    } else {
        loggedIn.forEach(element => {
            element.classList.add("hideElement");
        });

        loggedOut.forEach(element => {
            element.classList.add("showElement");
        });
    }
}

