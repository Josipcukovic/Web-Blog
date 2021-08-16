const renderBlogData = (document, stackOrder) => {

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

    blogList.insertAdjacentHTML(stackOrder, blogTemplate);
    dohvatiKomentare(document.id);
}