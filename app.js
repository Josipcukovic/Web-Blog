const blogRef = db.collection("blogs");



const blogForm = document.querySelector(".addNewBlogForm");
const blogList = document.querySelector("#blog-list");
const button = document.querySelector("#newBlog");
const omotac = document.querySelector(".omotac");
const popup = document.querySelector(".popUp");


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
function mojaFunkcija(e) {
    event.target.previousElementSibling.classList.toggle("mystyle");
}
///prikaz
const renderBlogData = (document) => {
    const data = document.data();
    const created_at = data.created_at.toDate();
    const now = new Date().getTime();
    const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });

    blogList.innerHTML += ` <li data-id=${document.id}> 
    <span>${data.title}</span>
     <img src="cat.jpg" alt="#">
      <span>${data.body}</span> 
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      <p class="createdAt" onmouseover="mojaFunkcija()" onmouseleave="mojaFunkcija()"> ${timeAgo} </p> 
      <div class='delete' >X</div> </li>`;

}

///brisanje
blogList.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove();
        const id = e.target.parentElement.getAttribute("data-id");
        blogRef.doc(id).delete();
    }
})

////listener
blogRef.onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(document => {

        if (document.type == "added") {
            renderBlogData(document.doc);
        } else if (document.type == "removed") {
            ///do nothing for now
        }
    })
})



//// moduli
button.addEventListener("click", (e) => {
    omotac.style.display = "block";
});

omotac.addEventListener("click", (e) => {
    if (e.target.className != "sadrzaj") {
        omotac.style.display = "none";
    }
});

popup.addEventListener("click", (e) => {
    e.stopPropagation();
});