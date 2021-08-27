const renderBlogData = (document, stackOrder) => {
  const putanja = window.location.pathname;
  const cat = "cat.jpg"
  const data = document.data();
  const created_at = data.created_at.toDate();
  const now = new Date().getTime();
  const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });
  const deleteTemplate = ` ${(putanja != "/reportedStuff.html" && putanja != "/reportedstuff") ? `<div class='delete' >X</div>` : `<button class="deleteReportedPost">Delete this post</button>`} `;
  const uvjet = (auth.currentUser != null);
  const commentSectionTemplate = ` <div class ="commentSection">
  <form class="commentForm">
    <input type="text" name="comment" placeholder="Your comment..." class="comment">
  </form>
  <ul class="commentsDisplay"> </ul>
  </div>`;

  const blogTemplate = ` <li class="blog-list-element" id=${document.id}> 
    <div class="prikaziBlog">
    <span class="prikaziBlogChildren">${data.title}</span>
     <img  class="prikaziBlogChildren blogPicture" src="${data.picture != null ? data.picture : cat}" alt="#">
      <span class="prikaziBlogChildren">${data.body}</span> 
      </div>
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      ${(putanja != "/reportedStuff.html" && putanja != "/reportedstuff") ? `<p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p>` : ""}
       
      ${(putanja != "/reportedStuff.html" && putanja != "/reportedstuff") ? `<p class="commentPost">Comment this post</p>` : ""}
      


      ${((uvjet && (data.created_by_id == auth.currentUser.uid) || (uvjet && auth.currentUser.uid == idToCheck.id)) ? deleteTemplate : "")}
      ${(putanja == "/reportedStuff.html" || putanja == "/reportedstuff") ? `<button class="okPost">This post is fine</button>` : ""}
     
        </li> 
      
      ${(putanja != "/reportedStuff.html" && putanja != "/reportedstuff") ? commentSectionTemplate : ""}
      
      `

  blogList.insertAdjacentHTML(stackOrder, blogTemplate);
  if (putanja != "/reportedStuff.html" && putanja != "/reportedstuff") {
    handleComments(document.id);
  };


}
