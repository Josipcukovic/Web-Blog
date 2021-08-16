
// return first.get().then((documentSnapshots) => {
//     // Get the last visible document
//     var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
//     console.log("last", lastVisible);

//     // Construct a new query starting at this document,
//     // get the next 25 cities.
//     var next = db.collection("cities")
//             .orderBy("population")
//             .startAfter(lastVisible)
//             .limit(25);
//   });


// const btn = document.querySelector(".klikni");
var lastVisible;
var next;

// btn.addEventListener("click", e => {
///show more data on scroll
window.onscroll = function (ev) {

    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight + 16) {
        console.log("tu");
        next.get().then(snapshot => {
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            next = blogRef
                .orderBy("created_at", "desc")
                .startAfter(lastVisible)
                .limit(5);
            console.log(lastVisible);
            snapshot.forEach(item => {

                renderBlogData(item, 'beforeend');
            })
        }).catch(e => {
            document.querySelector(".noMorePostsMessage").style.display = "block";
        })

    }
};



// blogRef.where("created_by_id", "==", id).orderBy("created_at", "asc").get().then(blogs => {
//     // console.log(auth.currentUser.displayName);
//     // const data = document.data();
//     blogs.docs.forEach(blog => {
//         console.log(blog.data());
//         const data = blog.data();
//         const created_at = data.created_at.toDate();
//         const now = new Date().getTime();
//         const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });

//         const blogTemplate = ` <li class="blog-list-element" id=${blog.id}> 
//           <p class ="author mojProfil">Written by: ${"Well, You"}</p>
//           <span>${data.title}</span>
//           <img src="${data.picture != null ? data.picture : cat}" alt="#" class="blogPicture">
//             <span>${data.body}</span> 
//             <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
//             <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
//             <p class="commentPost">Comment this post</p>
//             <div class='delete' >X</div>

//             </li> 

//             <div class ="commentSection" >
//             <form class="commentForm">
//               <input type="text" name="comment" placeholder="Your comment..." class="comment">
//             </form>
//             <ul class="commentsDisplay"> </ul>
//             </div> `
//         blogList.insertAdjacentHTML('afterbegin', blogTemplate);
//         dohvatiKomentare(blog.id);
//     })


// });
const searchBox = document.querySelector(".trazilica");
// const refresh = document.querySelector(".getBack");
// refresh.addEventListener("click", e => {
//     window.location.reload();
// })

searchBox.addEventListener("submit", e => {
    e.preventDefault();

    let term = searchBox["searchBox"].value.toLowerCase().trim();
    if (!term.trim()) {
        return;
    } else {
        blogList.innerHTML = "";
    }
    blogRef.orderBy('title_search').orderBy("created_at", "desc").startAt(term).endAt(term + '~').get().then(data => {
        let changes = data.docChanges().reverse();
        changes.forEach(blog => {

            renderBlogData(blog.doc, 'afterbegin');

        })
    });
    // console.log("dkdkdk");
})


// })
////listener
blogRef.orderBy("created_at", "desc").limit(5).get().then(snapshot => {
    let changes = snapshot.docChanges().reverse();

    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 25 cities.
    next = blogRef
        .orderBy("created_at", "desc")
        .startAfter(lastVisible)
        .limit(3);

    changes.forEach(doc => {

        if (doc.type == "added") {
            renderBlogData(doc.doc, 'afterbegin');

        }
    })
})

//ak sjebes
// const unsub = blogRef.orderBy("created_at", "desc").limit(3).onSnapshot(snapshot => {
//     let changes = snapshot.docChanges().reverse();

//     lastVisible = snapshot.docs[snapshot.docs.length - 1];
//     console.log("last", lastVisible);

//     // Construct a new query starting at this document,
//     // get the next 25 cities.
//     next = blogRef
//         .orderBy("created_at", "desc")
//         .startAfter(lastVisible)
//         .limit(3);

//     changes.forEach(doc => {

//         if (doc.type == "added") {
//             renderBlogData(doc.doc, 'afterbegin');
//         } else if (doc.type == "removed") {
//             const target = document.getElementById(doc.doc.id);
//             target.nextElementSibling.remove();
//             target.remove();
//         }
//     })
// })




///brisanje i dodavanje komentara
blogList.addEventListener("click", e => {
    e.preventDefault();

    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.getAttribute("id");
        const target = document.getElementById(id);
        target.nextElementSibling.remove();
        target.remove();
        blogRef.doc(id).delete();

    } else if (e.target.classList.contains("prikaziBlog")) {
        const id = e.target.parentElement.getAttribute("id");
        console.log(e.target);
        localStorage.setItem("id", id);
        window.location.href = "blogDetails.html";
    } else if (e.target.classList.contains("prikaziBlogChildren")) {
        const id = e.target.parentElement.parentElement.getAttribute("id");
        console.log(e.target);
        localStorage.setItem("id", id);
        window.location.href = "blogDetails.html";
    }
})


const link = document.querySelector(".myProfile");

link.addEventListener("click", e => {
    console.log(e.target);
    localStorage.setItem("id", auth.currentUser.uid);
    window.location.href = "myProfile.html";
});