const blogRef = db.collection("blogs");
const commentRef = db.collection("comments");


const blogForm = document.querySelector(".addNewBlogForm");
const blogList = document.querySelector("#blog-list");



blogForm.addEventListener("submit", e => {
    e.preventDefault();
    const now = new Date();
    const titleValue = blogForm["title"].value;
    const bodyValue = blogForm["body"].value;
    blogRef.add({
        title: titleValue,
        body: bodyValue,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    })
    blogForm.reset();
})

function toggleTimeCreated() {
    event.target.previousElementSibling.classList.toggle("timeCreated");
}

///prikaz
const renderBlogData = (document) => {
    const data = document.data();
    const created_at = data.created_at.toDate();
    const now = new Date().getTime();
    const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });

    const blogTemplate = `<li class="blog-list-element" id=${document.id}> 
    <span>${data.title}</span>
     <img src="cat.jpg" alt="#">
      <span>${data.body}</span> 
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
      <p class="commentPost">Comment this post</p>
      <div class='delete' >X</div>
         
      </li>

      <div class ="commentSection">
      <ul class="commentsDisplay"> </ul>
      <form class="commentForm">
        <input type="text" name="comment" placeholder="Your comment..." class="comment">
      </form>
      </div>
      `

    //   <button type="submit" class = "addComment">Add comment</button>
    dohvatiKomentare(document.id);
    //   blogRef.orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
    //     let changes = snapshot.docChanges().reverse();
    //     changes.forEach(document => {

    //         if (document.type == "added") {
    //             renderBlogData(document.doc);
    //         } else if (document.type == "removed") {
    //             ///do nothing for now
    //         }
    //     })
    // })

    blogList.insertAdjacentHTML('afterbegin', blogTemplate);
}

const addCommentFormListener = (forma, id) => {
    forma.addEventListener("submit", e => {
        e.preventDefault();
        const comment = forma.querySelector(".comment").value;
        const now = new Date();
        if (comment.trim() == "") {
            forma.reset();
            return;
        }
        commentRef.doc(id).collection("thisBlogComments").add({
            comment,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        })
        forma.reset();
    })
}
let removeListener;
const addComentListener = (commentShow, commentSection) => {
    commentShow.addEventListener("click", e => {

        if (commentSection.classList.contains("showComment")) {
            commentSection.classList.remove("showComment");
            const commentList = event.target.parentElement.nextElementSibling.querySelector(".commentsDisplay");
            commentList.innerHTML = "";
            removeListener();
        } else {
            commentSection.classList.add("showComment");
            const id = event.target.parentElement.getAttribute("id");


            var unsub = commentRef.doc(id).collection("thisBlogComments").orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
                const mojUl = document.getElementById(id);
                const commentSection = mojUl.nextElementSibling;

                const listaKomentara = commentSection.querySelector(".commentsDisplay");
                console.log(listaKomentara);


                let changes = snapshot.docChanges().reverse();
                changes.forEach(document => {
                    if (document.doc.data() == undefined) {
                        return;
                    }
                    console.log(document.doc.data());
                    if (document.type == "added") {
                        listaKomentara.insertAdjacentHTML('afterbegin', `<li>${document.doc.data().comment}</li>`);
                    } else if (document.type == "removed") {
                        ///do nothing for now
                    }
                })
            })
            removeListener = unsub;
            // mylilFunction(doc, listaKomentara);
            // dohvatiKomentare(id);

        }
        // commentSection.classList.add("showComment");
        // commentSection.classList.toggle("showComment");

        // i sad tu provjeravas jel ima ovu gore klasu, ako ima dohvati komentare i prikazi ih, ako nema nema ni komentara
    })
}

function dohvatiKomentare(id) {
    // commentRef.doc(id).collection("thisBlogComments").orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
    //     const mojUl = document.getElementById(id);
    //     const forma = mojUl.nextElementSibling.querySelector(".commentForm");
    //     const commentSection = mojUl.nextElementSibling;
    //     const commentShow = mojUl.querySelector(".commentPost");

    //     const listaKomentara = commentSection.querySelector(".commentsDisplay");
    //     console.log(listaKomentara);
    //     addCommentFormListener(forma, id);
    //     addComentListener(commentShow, commentSection, id);

    //     let changes = snapshot.docChanges().reverse();
    //     changes.forEach(document => {
    //         if (document.doc.data() == undefined) {
    //             return;
    //         }
    //         console.log(document.doc.data());
    //         if (document.type == "added") {
    //             listaKomentara.insertAdjacentHTML('afterbegin', `<li>${document.doc.data().comment}</li>`);
    //         } else if (document.type == "removed") {
    //             ///do nothing for now
    //         }
    //     })
    // })




    commentRef.doc(id).collection("thisBlogComments").orderBy("created_at", "desc").limit(20).get().then(doc => {
        const mojUl = document.getElementById(id);
        const forma = mojUl.nextElementSibling.querySelector(".commentForm");
        const commentSection = mojUl.nextElementSibling;
        const commentShow = mojUl.querySelector(".commentPost");

        const listaKomentara = commentSection.querySelector(".commentsDisplay");
        console.log(listaKomentara);
        addCommentFormListener(forma, id);
        addComentListener(commentShow, commentSection);

        ////probaj dodat listenera za svaki post i onda nes mozda morat brisati ul, neg samo stackas i tjt, svaki post ce imat svog listenera

        // if (item.data() == undefined) {
        //     return;
        // }
        // console.log(document.querySelector(`[data-id=${id}]`));
        // doc.forEach(item => {
        //     if (item.data() == undefined) {
        //         return;
        //     }
        //     listaKomentara.innerHTML += `<li>${item.data().comment}</li>`;
        //     console.log(item.data());
        // });

        // mylilFunction(doc);
    })
}
// function mylilFunction(doc, listaKomentara) {

//     console.log(doc.docs.reverse());
//     doc.docs.reverse().forEach(item => {
//         if (item.data() == undefined) {
//             return;
//         }
//         listaKomentara.insertAdjacentHTML('afterbegin', `<li>${item.data().comment}</li>`);
//         // listaKomentara.innerHTML += `<li>${item.data().comment}</li>`;
//         console.log(item.data());
//     });
// }
///brisanje i dodavanje komentara
blogList.addEventListener("click", e => {
    e.preventDefault();

    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.getAttribute("id");
        // e.target.parentElement.nextElementSibling.remove();
        // e.target.parentElement.remove();


        blogRef.doc(id).delete();
    }
    // else if (e.target.classList.contains("addComment")) {
    //     const id = e.target.parentElement.getAttribute("id");
    //     const comment = e.target.previousElementSibling.value;
    //     const now = new Date();

    //     commentRef.doc(id).collection("thisBlogComments").add({
    //         comment,
    //         created_at: firebase.firestore.Timestamp.fromDate(now)
    //     })

    //     // commentRef.doc(id).collection("thisBlogComments").orderBy("created_at", "desc").get().then(doc => {
    //     //     const mojUl = document.getElementById(id);

    //     //     // if (item.data() == undefined) {
    //     //     //     return;
    //     //     // }
    //     //     // console.log(document.querySelector(`[data-id=${id}]`));
    //     //     console.log(doc.forEach(item => {
    //     //         if (item.data() == undefined) {
    //     //             return;
    //     //         }
    //     //         // komentari.insertAdjacentHTML("afterend", `<p>${item.data().comment}</p>`)
    //     //         console.log(item.data());
    //     //     }));
    //     // })

    // }
})

////listener
blogRef.orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
    let changes = snapshot.docChanges().reverse();
    changes.forEach(doc => {

        if (doc.type == "added") {
            renderBlogData(doc.doc);
        } else if (doc.type == "removed") {
            const target = document.getElementById(doc.doc.id);
            target.nextElementSibling.remove()
            target.remove();
            // console.log(document.doc.id);
        }
    })
})



//// moduli
const button = document.querySelector("#newBlog");
const wrapper = document.querySelector(".wrapper");
const popup = document.querySelectorAll(".popUp");

const buttonLogin = document.querySelector("#login");
const buttonRegister = document.querySelector("#register");


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

wrapperLogin.addEventListener("click", (e) => {
    if (e.target.className != "content") {
        wrapperLogin.style.display = "none";
    }
});

//register

buttonRegister.addEventListener("click", (e) => {
    wrapperRegister.style.display = "block";
    wrapperLogin.style.display = "none";
    wrapper.style.display = "none";
});

wrapperRegister.addEventListener("click", (e) => {
    if (e.target.className != "content") {
        wrapperRegister.style.display = "none";
    }
});