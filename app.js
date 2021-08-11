
///prikaz
const renderBlogData = (document) => {
    const data = document.data();
    const created_at = data.created_at.toDate();
    const now = new Date().getTime();
    const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });
    // console.log(data);

    const blogTemplate = ` <li class="blog-list-element" id=${document.id}> 
    <div class="prikaziBlog">
    <span class="prikaziBlogChildren">${data.title}</span>
     <img  class="prikaziBlogChildren" src="${data.picture != null ? data.picture : cat}" alt="#">
      <span class="prikaziBlogChildren">${data.body}</span> 
      </div>
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

    blogList.insertAdjacentHTML('afterbegin', blogTemplate);
    dohvatiKomentare(document.id);
}


////listener
const unsub = blogRef.orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
    let changes = snapshot.docChanges().reverse();
    changes.forEach(doc => {

        if (doc.type == "added") {
            renderBlogData(doc.doc);
        } else if (doc.type == "removed") {
            const target = document.getElementById(doc.doc.id);
            target.nextElementSibling.remove()
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


