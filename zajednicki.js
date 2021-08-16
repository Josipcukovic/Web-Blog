const blogRef = db.collection("blogs");
const commentRef = db.collection("comments");
let linkSlike;

const blogForm = document.querySelector(".addNewBlogForm");
const cat = "cat.jpg"

const blogList = document.querySelector("#blog-list");
const addBlogPictureButton = document.getElementById("blogPhoto");


const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(1) + Math.random().toString(36).substr(1);
}

addBlogPictureButton.addEventListener("change", e => {
    const file = e.target.files[0];
    const name = file.name;
    const metadata = {
        contentType: file.type,
    };
    const Storageref = storageDb.ref("Blog pictures/" + uid());

    Storageref.child(name).put(file, metadata).then((snapshot) => snapshot.ref.getDownloadURL()).then((link) => {
        ///dodaj postotak uploada
        linkSlike = link;
    });


});

const putanja = window.location.pathname;

///dodavanje novog bloga
blogForm.addEventListener("submit", e => {
    e.preventDefault();
    const now = new Date();
    const titleValue = blogForm["title"].value;
    const bodyValue = blogForm["body"].value;
    if (auth.currentUser == null) {
        ////none registrated user wants to make a new post
        alert("Congratz, you almost made a new post but please, You must login to make new posts");
        blogForm.reset();
        blogForm.parentElement.parentElement.parentElement.remove();
        return;
    }
    blogRef.add({
        title: titleValue.trim(),
        title_search: titleValue.toLowerCase().trim(),
        body: bodyValue.trim(),
        created_at: firebase.firestore.Timestamp.fromDate(now),
        created_by: auth.currentUser.displayName,
        created_by_id: auth.currentUser.uid,
        picture: linkSlike
    });
    ////get new one
    if (putanja == "/index.html") {
        blogRef.orderBy("created_at", "desc").limit(1).get().then(snapshot => {
            let changes = snapshot.docChanges().reverse();

            changes.forEach(doc => {
                renderBlogData(doc.doc, 'afterbegin');
            })
        });
    }


    linkSlike = null;
    blogForm.reset();

})

function toggleTimeCreated() {
    event.target.previousElementSibling.classList.toggle("timeCreated");
}

const addCommentFormListener = (forma, id) => {
    forma.addEventListener("submit", e => {
        e.preventDefault();
        const comment = forma.querySelector(".comment").value;
        const now = new Date();
        if (comment.trim() == "") {
            forma.reset();
            return;
        } else if (auth.currentUser == null) {
            alert("You must login to comment");
            forma.reset();
            return;
        }
        commentRef.doc(id).collection("thisBlogComments").add({
            comment,
            created_at: firebase.firestore.Timestamp.fromDate(now),
            created_by_id: auth.currentUser.uid
        })
        forma.reset();
    })
}


let removeListener;
const addComentListener = (commentShow, commentSection) => {
    commentShow.addEventListener("click", e => {
        if (commentSection.classList.contains("showComment")) {

            commentSection.classList.remove("showComment");
            console.log(event.target.parentElement);
            const commentList = event.target.parentElement.nextElementSibling.querySelector(".commentsDisplay");

            commentList.innerHTML = "";
            removeListener();

        } else {

            commentSection.classList.add("showComment");
            const id = event.target.parentElement.getAttribute("id");


            var unsub = commentRef.doc(id).collection("thisBlogComments").orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
                const mojUl = document.getElementById(id);
                const commentSection = mojUl.nextElementSibling;
                console.log(snapshot.docs);

                const listaKomentara = commentSection.querySelector(".commentsDisplay");

                let changes = snapshot.docChanges().reverse();
                changes.forEach(document => {
                    if (document.doc.data() == undefined) {
                        return;
                    }
                    if (document.type == "added") {

                        userRef.doc(document.doc.data().created_by_id).get().then(doc => {

                            const data = doc.data();
                            listaKomentara.insertAdjacentHTML('afterbegin', `<li class="commentElement grid"><img src="${(data && data.slika) ? data.slika : "cat.jpg"}" alt="#" class="pictureOnComment"><r>${data ? `${data.ime} ${data.prezime}` : "unknown"}</r><z>${document.doc.data().comment}</z></li>`);
                            // main.innerHTML += template;
                        });


                        // listaKomentara.insertAdjacentHTML('afterbegin', `<li class="commentElement grid"><img src="cat.jpg" alt="#" class="pictureOnComment"><z>${document.doc.data().comment}</z></li>`);
                    } else if (document.type == "removed") {
                        ///do nothing for now
                    }
                })
            })
            removeListener = unsub;

        }
    })
}

function dohvatiKomentare(id) {

    const mojUl = document.getElementById(id);
    const forma = mojUl.nextElementSibling.querySelector(".commentForm");
    const commentSection = mojUl.nextElementSibling;
    const commentShow = mojUl.querySelector(".commentPost");

    const listaKomentara = commentSection.querySelector(".commentsDisplay");
    addCommentFormListener(forma, id);
    addComentListener(commentShow, commentSection);
}



//// moduli
const button = document.querySelector("#newBlog");
const wrapper = document.querySelector(".wrapper");
const popup = document.querySelectorAll(".popUp");

const buttonLogin = document.querySelector("#login");
const buttonRegister = document.querySelector("#register");



const wrapperRegister = document.querySelector(".wrapper-register");
const wrapperLogin = document.querySelector(".wrapper-login");


button.addEventListener("click", (e) => {
    wrapper.style.display = "block";
    //declared in auth.js
    wrapperLogin.style.display = "none";
    wrapperRegister.style.display = "none";

});

wrapper.addEventListener("click", (e) => {
    if (e.target.className != "content") {
        wrapper.style.display = "none";

    }
});

popup.forEach(popup => {
    popup.addEventListener("click", (e) => {
        e.stopPropagation();
    });
})

//login
buttonLogin.addEventListener("click", (e) => {
    wrapperLogin.style.display = "block";
    wrapper.style.display = "none";
    wrapperRegister.style.display = "none";
});
if (wrapperLogin) {
    wrapperLogin.addEventListener("click", (e) => {
        if (e.target.className != "content") {
            wrapperLogin.style.display = "none";
        }
    });
}


//register

buttonRegister.addEventListener("click", (e) => {
    wrapperRegister.style.display = "block";
    wrapperLogin.style.display = "none";
    wrapper.style.display = "none";
});

if (wrapperRegister) {
    wrapperRegister.addEventListener("click", (e) => {
        if (e.target.className != "content") {
            wrapperRegister.style.display = "none";
        }
    });
}




