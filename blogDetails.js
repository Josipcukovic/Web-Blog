// const blogReff = db.collection("blogs");
// const blogList = document.querySelector("#blog-list");
const id = localStorage.getItem("id");
console.log(id);


function toggleTimeCreated() {
  event.target.previousElementSibling.classList.toggle("timeCreated");
}

///dohvati blog
blogRef.doc(id).get().then(document => {
  console.log(document.data());
  const data = document.data();
  const created_at = data.created_at.toDate();
  const now = new Date().getTime();
  const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });

  const blogTemplate = ` <li class="blog-list-element" id=${document.id}> 
    <p class ="author">Written by: ${data.created_by}</p>
    <span>${data.title}</span>
    <img src="${data.picture != null ? data.picture : cat}" alt="#">
      <span>${data.body}</span> 
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
      <p class="commentPost">Comment this post</p>
      <div class='delete' >X</div>
         
      </li> 

      <div class ="commentSection" >
      <ul class="commentsDisplay"> </ul>
      <form class="commentForm">
        <input type="text" name="comment" placeholder="Your comment..." class="comment">
      </form>
      </div> `
  blogList.insertAdjacentHTML('afterbegin', blogTemplate);
  dohvatiKomentare(document.id);


});


const link = document.querySelector(".myProfile");

link.addEventListener("click", e => {
  console.log(e.target);
  localStorage.setItem("id", auth.currentUser.uid);
  unsub();
  window.location.href = "myProfile.html";
});