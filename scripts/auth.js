
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
const myname = document.querySelector(".myName");
//
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(auth.currentUser.uid);
        // const toDoRef = db.ref(`/toDo/${auth.currentUser.uid}`);
        showElements(user);
        // toDoRef.on("child_added", showTodo);
    } else {
        showElements();
    }
});

let idToCheck = "";
const adminRef = db.collection("admins");

adminRef.get().then(docs => {
    docs.forEach(admin => {
        idToCheck = admin.data();


        ///promjeni ovo ako je potrebno
        if (auth.currentUser.uid == idToCheck.id) {
            const linkovi = document.querySelector("#links");
            const template = `<li class="reportedBlogs"><a href="reportedStuff.html" id="reportedBlogs">Reported Posts</a></li>`;
            linkovi.insertAdjacentHTML('afterbegin', template);
        }
    })
}).catch(eror => {
    ///do nothing, just catch it
})

//logout
const logoutButton = document.querySelector("#logout");


logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("odlogiran si");
    auth.signOut().catch((error) => {
        window.alert(error.message);
    });

    window.location.href = "index.html";
});


const logout = document.querySelector(".Logout");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const newBlog = document.querySelector(".NewBlog");
const home = document.querySelector(".home");
const myprofile = document.querySelector(".myProfile");

function showElements(user) {
    if (home) {
        home.style.display = "block";
    }
    if (user) {
        // kada budes refaktorirao, idi s classlist

        if (myprofile) {
            myprofile.style.display = "block";
        }
        login.style.display = "none";
        register.style.display = "none";
        logout.style.display = "block";
        newBlog.style.display = "block"
    }
    else {
        myprofile.style.display = "none";
        logout.style.display = "none";
        login.style.display = "block";
        register.style.display = "block";
        newBlog.style.display = "none"

    }
}


// const blogPhoto = document.getElementById("blogPhoto");
