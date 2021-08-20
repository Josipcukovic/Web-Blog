// const blogReff = db.collection("blogs");
// const blogList = document.querySelector("#blog-list");
const id = localStorage.getItem("id");
console.log(id);


function toggleTimeCreated() {
  event.target.previousElementSibling.classList.toggle("timeCreated");
}


const getComments = (id) => {
  commentRef.doc(id).collection("thisBlogComments").orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
    console.log(snapshot);
    const mojUl = document.getElementById(id);
    const commentSection = mojUl.nextElementSibling;
    const forma = commentSection.querySelector(".commentForm");
    addCommentFormListener(forma, id);
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
      }

    })
  })
}


///dohvati blog
blogRef.doc(id).get().then(document => {
  console.log(document.data());
  const data = document.data();
  const created_at = data.created_at.toDate();
  const now = new Date().getTime();
  const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });
  let njegova;
  const ownerOfTheBlog = auth.currentUser ? (data.created_by_id == auth.currentUser.uid) : false;
  const ownerOfTheBlogOrAdmin = auth.currentUser ? ((data.created_by_id == auth.currentUser.uid) || (auth.currentUser.uid == idToCheck.id)) : false;
  ///ovo je privremeno tu, promjeni to tako da svaki user mora imati sliku cim se registrira, tj uvalis mu defaultnu. Takodjer obrisi sve stare postove i usere
  //tako da svi imaju id itd... ovo njegova ces isto obrisati i izmjeniti tako sto ce uzeti userovu sliku, posto ju mora imati i ubacit ces ju
  userRef.doc(data.created_by_id).get().then(user => {
    const userData = user.data();

    if ((userData != undefined)) {
      if (userData.slika != undefined) {
        njegova = userData.slika;
      }
      else {
        njegova = "cat.jpg";
      }
    }
    else {
      njegova = "cat.jpg";
    }
    const deleteTemplate = `<div class='delete' >X</div>`;
    const blogTemplate = ` <li class="blog-list-element" id=${document.id}> 
  <img src="${ownerOfTheBlog ? (auth.currentUser.photoURL != null ? auth.currentUser.photoURL : "cat.jpg") : njegova}" alt="#" class="profilna">
    <p class ="author">Written by: ${ownerOfTheBlog ? "You" : data.created_by}</p>
    <span>${data.title}</span>
    <img src="${data.picture != null ? data.picture : cat}" alt="#" class="blogPicture">
      <span class="dataBody">${data.body}</span> 
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
      ${ownerOfTheBlogOrAdmin ? deleteTemplate : ""}
         
      </li> 

      <div class ="commentSection details showComment" >
      <form class="commentForm">
        <input type="text" name="comment" placeholder="Your comment..." class="comment">
      </form>
      <ul class="commentsDisplay"> </ul>
      </div> `
    blogList.insertAdjacentHTML('afterbegin', blogTemplate);
    getComments(document.id);

  })
  //////






});


const link = document.querySelector(".myProfile");

link.addEventListener("click", e => {
  console.log(e.target);
  localStorage.setItem("id", auth.currentUser.uid);
  window.location.href = "myProfile.html";
});


//deleting
blogList.addEventListener("click", e => {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    const id = e.target.parentElement.getAttribute("id");
    const target = document.getElementById(id);
    target.nextElementSibling.remove();
    target.remove();
    blogRef.doc(id).delete();
  }
})


const reportButton = document.querySelector(".report");
const reportsRef = db.collection("reports");

reportButton.addEventListener("click", e => {

  reportsRef.doc(id).get().then((doc) => {

    if (doc.exists) {
      console.log("Document data:", doc.data());
      reportsRef.doc(id).set({
        reportedId: id,
        reportedTimes: (doc.data().reportedTimes ? doc.data().reportedTimes + 1 : 0)
      });

    } else {
      // doc.data() will be undefined in this case
      reportsRef.doc(id).set({
        reportedId: id,
        reportedTimes: 1
      });
      console.log("No such document!");
    }

  }).catch((error) => {
    console.log("Error getting document");
  });


})








// commentRef.doc(id).collection("thisBlogComments").add({
//   comment,
//   created_at: firebase.firestore.Timestamp.fromDate(now),
//   created_by_id: auth.currentUser.uid
// })

// userRef.doc(`${currentUser.uid}`).set(user);