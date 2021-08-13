

///prikaz
const renderBlogData = (document) => {

    const data = document.data();
    const created_at = data.created_at.toDate();
    const now = new Date().getTime();
    const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });
    const deleteTemplate = `<div class='delete' >X</div>`;
    const uvjet = (auth.currentUser != null);


    const blogTemplate = ` <li class="blog-list-element" id=${document.id}> 
    <div class="prikaziBlog">
    <span class="prikaziBlogChildren">${data.title}</span>
     <img  class="prikaziBlogChildren blogPicture" src="${data.picture != null ? data.picture : cat}" alt="#">
      <span class="prikaziBlogChildren">${data.body}</span> 
      </div>
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
      <p class="commentPost">Comment this post</p>


      ${((uvjet && (data.created_by_id == auth.currentUser.uid) || (uvjet && auth.currentUser.uid == idToCheck.id)) ? deleteTemplate : "")}


      </li> 

      <div class ="commentSection">
      <form class="commentForm">
        <input type="text" name="comment" placeholder="Your comment..." class="comment">
      </form>
      <ul class="commentsDisplay"> </ul>
      </div>
      `

    blogList.insertAdjacentHTML('afterbegin', blogTemplate);
    dohvatiKomentare(document.id);
}



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
// var lastVisible;
// var next;

// btn.addEventListener("click", e => {
//     next.get().then(snapshot => {
//         lastVisible = snapshot.docs[snapshot.docs.length - 1];
//         next = blogRef
//             .orderBy("created_at", "desc")
//             .startAfter(lastVisible)
//             .limit(2);
//         console.log(lastVisible);
//         snapshot.forEach(item => {

//             renderBlogData(item, 'beforeend');
//         })
//     })
// })
////listener
const unsub = blogRef.orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
    let changes = snapshot.docChanges().reverse();

    // lastVisible = snapshot.docs[snapshot.docs.length - 1];
    // console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 25 cities.
    // next = blogRef
    //     .orderBy("created_at", "desc")
    //     .startAfter(lastVisible)
    //     .limit(2);

    changes.forEach(doc => {

        if (doc.type == "added") {
            renderBlogData(doc.doc);
        } else if (doc.type == "removed") {
            const target = document.getElementById(doc.doc.id);
            target.nextElementSibling.remove();
            target.remove();
        }
    })
})



///brisanje i dodavanje komentara
blogList.addEventListener("click", e => {
    e.preventDefault();

    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.getAttribute("id");
        blogRef.doc(id).delete();

    } else if (e.target.classList.contains("prikaziBlog")) {
        const id = e.target.parentElement.getAttribute("id");
        console.log(e.target);
        localStorage.setItem("id", id);
        unsub();
        window.location.href = "blogDetails.html";
    } else if (e.target.classList.contains("prikaziBlogChildren")) {
        const id = e.target.parentElement.parentElement.getAttribute("id");
        console.log(e.target);
        localStorage.setItem("id", id);
        unsub();
        window.location.href = "blogDetails.html";
    }
})


const link = document.querySelector(".myProfile");

link.addEventListener("click", e => {
    console.log(e.target);
    localStorage.setItem("id", auth.currentUser.uid);
    unsub();
    window.location.href = "myProfile.html";
});