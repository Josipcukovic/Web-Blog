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
        location.reload();
    }).catch((error) => {
        window.alert(error.message);
    });
})
