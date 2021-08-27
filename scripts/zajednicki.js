const blogRef = db.collection("blogs");
const commentRef = db.collection("comments");
let linkSlike;

const blogForm = document.querySelector(".addNewBlogForm");
const cat = "cat.jpg"

const blogList = document.querySelector("#blog-list");
const addBlogPictureButton = document.getElementById("blogPhoto");

const isUserLoggedOut = () => {
    return (auth.currentUser == null);
}
const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(1) + Math.random().toString(36).substr(1);
}

const loadingMessage = document.querySelector(".loadingMessage");
const inputForPostImage = document.querySelector("#selectImage");

const handleBlogPicture = (e) => {
    const file = e.target.files[0];
    const name = file.name;
    const metadata = {
        contentType: file.type,
    };
    const Storageref = storageDb.ref("Blog pictures/" + uid());
    loadingMessage.style.display = "block";
    Storageref.child(name).put(file, metadata).then((snapshot) => {

        return snapshot.ref.getDownloadURL();
    }).then((link) => {

        loadingMessage.innerHTML = "Your picture is uploaded.";
        linkSlike = link;
    });
}

inputForPostImage.addEventListener("click", e => {
    var input = document.createElement("input");
    input.type = "file";
    input.click();

    input.onchange = e => {
        handleBlogPicture(e);
    }
})

const getLastPost = async () => {
    blogRef.orderBy("created_at", "desc").limit(1).get().then(snapshot => {
        let changes = snapshot.docChanges().reverse();

        changes.forEach(doc => {
            renderBlogData(doc.doc, 'afterbegin');
        })
    }).catch(e => {

    });
}

const addBlogToDatabase = async (titleValue, bodyValue, linkSlike) => {
    const now = new Date();
    await blogRef.add({
        title: titleValue.trim(),
        title_search: titleValue.toLowerCase().trim(),
        body: bodyValue.trim(),
        created_at: firebase.firestore.Timestamp.fromDate(now),
        created_by: auth.currentUser.displayName,
        created_by_id: auth.currentUser.uid,
        picture: linkSlike
    })
    getLastPost();
}

const resetBlogFormValues = () => {
    linkSlike = null;
    blogForm.reset();
    loadingMessage.style.display = "none";
    loadingMessage.innerHTML = "Input the text of your blog here...";
}
const putanja = window.location.pathname;

///dodavanje novog bloga
blogForm.addEventListener("submit", e => {
    e.preventDefault();

    const titleValue = blogForm["title"].value;
    const bodyValue = blogForm["body"].value;

    if (isUserLoggedOut()) {
        alert("Congratz, you almost made a new post but please, You must login to make new posts");
        blogForm.reset();
        blogForm.parentElement.parentElement.parentElement.remove();
        return;
    }
    if (!titleValue.trim() || !bodyValue.trim() || !linkSlike) {
        alert("please fill in all the fields and choose post picture");
        return;
    }
    addBlogToDatabase(titleValue, bodyValue, linkSlike);
    resetBlogFormValues();
})

function toggleTimeCreated() {
    event.target.previousElementSibling.classList.toggle("timeCreated");
}

const resetFormInputs = (form) => {
    form.reset();
}

const addCommentToDatabase = (comment, blogId) => {
    const now = new Date();
    commentRef.doc(blogId).collection("thisBlogComments").add({
        comment,
        created_at: firebase.firestore.Timestamp.fromDate(now),
        created_by_id: auth.currentUser.uid
    })
}

const addCommentFormListener = (forma, id) => {
    forma.addEventListener("submit", e => {
        e.preventDefault();
        const comment = forma.querySelector(".comment").value;

        if (comment.trim() == "") {
            resetFormInputs(forma);
            return;
        } else if (isUserLoggedOut()) {
            alert("You must login to comment");
            resetFormInputs(forma);
            return;
        }
        addCommentToDatabase(comment, id);
        resetFormInputs(forma);
    })
}
const renderUserInfoOnComments = (commentsDisplaySection, commentData) => {
    userRef.doc(commentData.doc.data().created_by_id).get().then(doc => {
        const data = doc.data();
        commentsDisplaySection.insertAdjacentHTML
            ('afterbegin', `<li class="commentElement grid">
        <img src="${(data && data.slika) ? data.slika : "cat.jpg"}" alt="#" class="pictureOnComment">
        <div class="individualComment grid">
            <r>${data ? `${data.ime} ${data.prezime}` : "unknown"}</r>
            <z>${commentData.doc.data().comment}</z>
          </div>
          </li>`);
    });
}

const processCommentData = (comments, commentsDisplaySection) => {
    comments.forEach(commentData => {
        if (commentData.doc.data() == undefined) return;
        if (commentData.type == "added") {
            renderUserInfoOnComments(commentsDisplaySection, commentData);

        } else if (document.type == "removed") {
            ///do nothing for now
        }
    })
}

const renderComments = (commentSection, snapshot) => {
    const commentsDisplaySection = commentSection.querySelector(".commentsDisplay");
    let changes = snapshot.docChanges().reverse();
    processCommentData(changes, commentsDisplaySection);
}

let removeCommentListener;


///prikazivanje komentara
const addCommentListener = (commentShow, commentSection) => {
    commentShow.addEventListener("click", e => {
        if (commentSection.classList.contains("showComment")) {
            commentSection.classList.remove("showComment");
            const commentList = event.target.parentElement.nextElementSibling.querySelector(".commentsDisplay");
            commentList.innerHTML = "";
            removeCommentListener();

        } else {

            commentSection.classList.add("showComment");
            const postId = event.target.parentElement.getAttribute("id");
            var unsub = commentRef.doc(postId).collection("thisBlogComments").orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
                const post = document.getElementById(postId);
                const commentSection = post.nextElementSibling;
                renderComments(commentSection, snapshot);
            })

            removeCommentListener = unsub;

        }
    })
}

function dohvatiKomentare(postId) {

    const post = document.getElementById(postId);
    const forma = post.nextElementSibling.querySelector(".commentForm");
    const commentSection = post.nextElementSibling;
    const commentShow = post.querySelector(".commentPost");

    addCommentFormListener(forma, postId);
    addCommentListener(commentShow, commentSection);


}



//// moduli
const buttonNewBlog = document.querySelector("#newBlog");
const wrapper = document.querySelector(".wrapper");
const popup = document.querySelectorAll(".popUp");

const buttonLogin = document.querySelector("#login");
const buttonRegister = document.querySelector("#register");



const wrapperRegister = document.querySelector(".wrapper-register");
const wrapperLogin = document.querySelector(".wrapper-login");


buttonNewBlog.addEventListener("click", (e) => {
    wrapper.style.display = "block";
    //declared in auth.js
    if (wrapperLogin) {
        wrapperLogin.style.display = "none";
    }
    if (wrapperRegister) {
        wrapperRegister.style.display = "none";
    }


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



const toggleHamburgerButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector("#nav-links");
const searchBoxy = document.querySelector(".searchForm");

toggleHamburgerButton.addEventListener("click", e => {
    navLinks.classList.toggle("active");
    if (searchBoxy) {
        searchBoxy.classList.toggle("active");
    }
    toggleHamburgerButton.classList.toggle("open");
})