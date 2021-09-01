const renderBlogData = (document, stackOrder, pageCalling) => {
  const cat = "../img/cat.jpg"
  const data = document.data();
  const created_at = data.created_at.toDate();
  const now = new Date().getTime();
  const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });
  const deleteTemplate = ` ${(pageCalling != "reportedStuff") ? `<div class='delete' >X</div>` : `<button class="deleteReportedPost">Delete this post</button>`} `;
  const userIsLoggedIn = (auth.currentUser != null);

  const commentSectionTemplate = ` <div class ="commentSection">
  <form class="commentForm">
    <input type="text" name="comment" placeholder="Your comment..." class="comment">
  </form>
  <ul class="commentsDisplay"> </ul>
  </div>`;

  const blogTemplate = ` <li class="blog-list-element" id=${document.id} aria-label="blog"> 
    <div class="prikaziBlog">
    <span class="prikaziBlogChildren" aria-label="blog title">${data.title}</span>
     <img  class="prikaziBlogChildren blogPicture" src="${data.picture != null ? data.picture : cat}" alt="blog picture" aria-label="blog picture">
      <span class="prikaziBlogChildren" aria-label="blog body">${data.body}</span> 
      </div>
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      ${(pageCalling != "reportedStuff") ? `<p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()" aria-label="creation time"> ${timeAgo} </p>` : ""}
       
      ${(pageCalling != "reportedStuff") ? `<p class="commentPost" aria-label="Open comment section button">Comment this post</p>` : ""}
      
      ${((userIsLoggedIn && (data.created_by_id == auth.currentUser.uid) || (userIsLoggedIn && auth.currentUser.uid == idToCheck.id)) ? deleteTemplate : "")}
      ${(pageCalling == "reportedStuff") ? `<button class="okPost">This post is fine</button>` : ""}
     
        </li> 
      
      ${(pageCalling != "reportedStuff") ? commentSectionTemplate : ""}
      
      `

  blogList.insertAdjacentHTML(stackOrder, blogTemplate);
  if (pageCalling != "reportedStuff") {
    handleComments(document.id);
  };


}