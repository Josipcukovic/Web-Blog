const postId = localStorage.getItem("postId");
const reportButton = document.querySelector(".report");

const getComments = (postId) => {
  commentRef.doc(postId).collection("thisBlogComments").orderBy("created_at", "desc").onSnapshot(snapshot => {
    const commentSection = document.querySelector(".commentSection")
    const forma = commentSection.querySelector(".commentForm");
    addCommentFormListener(forma, postId);
    renderComments(commentSection, snapshot);
  })
}
const getDeleteTemplate = () => {
  return (`<div class='delete' aria-label="delete blog button" role="button" >X</div>`)
}

const showReportButton = () => {
  reportButton.classList.add("show");
}
const defaultUserPicture = "../img/userPic.png";
///dohvati blog
blogRef.doc(postId).get().then(document => {
  const data = document.data();
  const created_at = data.created_at.toDate();
  const now = new Date().getTime();
  const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });
  let ownerPicture;
  const ownerOfTheBlog = auth.currentUser ? (data.created_by_id == auth.currentUser.uid) : false;
  const ownerOfTheBlogOrAdmin = auth.currentUser ? ((data.created_by_id == auth.currentUser.uid) || (auth.currentUser.uid == idToCheck.id)) : false;
  userRef.doc(data.created_by_id).get().then(user => {
    const userData = user.data();

    if ((userData != undefined)) {
      if (userData.slika != undefined) {
        ownerPicture = userData.slika;
      }
      else {
        ownerPicture = defaultUserPicture;
      }
    }
    else {
      ownerPicture = defaultUserPicture;
    }

    const deleteTemplate = getDeleteTemplate();
    const blogTemplate = ` <li class="blog-list-element" id=${document.id} aria-label="blog"> 
  <img src="${ownerOfTheBlog ? (auth.currentUser.photoURL != null ? auth.currentUser.photoURL : defaultUserPicture) : ownerPicture}" alt="user picture" aria-label="user profile picture" class="profilna">
    <p class ="author">Written by: ${ownerOfTheBlog ? "You" : data.created_by}</p>
    <span class="titleOfPost" aria-label="blog title">${data.title}</span>
    <img src="${data.picture != null ? data.picture : cat}" alt="#" class="blogPicture" alt="blog picture" aria-label="blog picture">
      <span class="dataBody" aria-label="blog body">${data.body}</span> 
      <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
      <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()" aria-label="creation time"> ${timeAgo} </p> 
      ${ownerOfTheBlogOrAdmin ? deleteTemplate : ""}
      
      </li> 
      <div class="reactionContainer grid" aria-label="reaction section">
      <div class="likeContainer" aria-label="like section">
      <p class="like-number" aria-label="number of likes"></p>
      <i class="fas fa-thumbs-up  fa-lg like" role="button" aria-label="like button"></i>
      </div>
      <div class="dislikeContainer" aria-label="dislike section">
      <p class="dislike-number" aria-label="number of dislikes"></p>
      <i class="fas fa-thumbs-down fa-lg dislike" role="button" aria-label="dislike button"></i>
      </div>
      </div>
      
      <div class ="commentSection details showComment" >
      <form class="commentForm">
        <input type="text" name="comment" placeholder="Your comment..." class="comment" aria-label="input for your comment">
      </form>
      <ul class="commentsDisplay" aria-label="comments"> </ul>
      </div> 
      `
    blogList.insertAdjacentHTML('afterbegin', blogTemplate);
    getComments(document.id);
    getLikes();
    showReportButton();
  })

});

let unsubLikes = null;
let unsubDislikes = null;

const getDislikes = () => {
  const dislikeRef = db.collection("dislikes").doc(postId).collection("dislikedBy");
  unsubDislikes = dislikeRef.onSnapshot((doc) => {
    const dislikeNumber = document.querySelector(".dislike-number");
    dislikeNumber.innerHTML = doc.size;

  })
}

function getLikes() {

  const likeRef = db.collection("likes").doc(postId).collection("likedBy");
  unsubLikes = likeRef.onSnapshot((doc) => {
    const likeNumber = document.querySelector(".like-number");
    likeNumber.innerHTML = doc.size;

  })
  getDislikes();

}

const openUserProfile = () => {
  localStorage.setItem("userId", auth.currentUser.uid);
  window.location.href = "../pages/myProfile.html";
}

const link = document.querySelector(".myProfile");

link.addEventListener("click", e => {
  if (unsubLikes != null) {
    unsubLikes();
  }
  if (unsubDislikes != null) {
    unsubDislikes();
  }
  openUserProfile();
});


////lajkovi

const handleLikesAndDislikes = (path) => {
  path.get().then((doc) => {
    if (doc.exists) {
      path.delete();
    }
  })
};

const handlePostDelete = () => {
  const target = document.getElementById(postId);
  const parent = target.parentElement;
  parent.nextElementSibling.remove();
  parent.remove();
  blogRef.doc(postId).delete();
}

let likePressedCounter = 1;
let dislikePressedCounter = 0;

const handleLikePressedTwice = () => {
  const likeRef = db.collection("likes").doc(postId).collection("likedBy").doc(auth.currentUser.uid);;
  handleLikesAndDislikes(likeRef);
  likePressedCounter = 1;
}

const handleDislikePressedTwice = () => {
  const dislikeRef = db.collection("dislikes").doc(postId).collection("dislikedBy").doc(auth.currentUser.uid);
  handleLikesAndDislikes(dislikeRef);
  dislikePressedCounter = 1;
}

const handleLikePressedFirstTime = () => {
  const likeRef = db.collection("likes");
  likePressedCounter++;
  dislikePressedCounter = 1;
  likeRef.doc(postId).collection("likedBy").doc(auth.currentUser.uid).set({
    likedby: auth.currentUser.uid
  })
}

const handleDislikePressedFirstTime = () => {
  const dislikeRef = db.collection("dislikes");
  dislikePressedCounter++;
  likePressedCounter = 1;
  dislikeRef.doc(postId).collection("dislikedBy").doc(auth.currentUser.uid).set({
    dislikedby: auth.currentUser.uid
  })
}

const handleLikeClick = () => {
  const dislikeRef = db.collection("dislikes").doc(postId).collection("dislikedBy").doc(auth.currentUser.uid);
  handleLikesAndDislikes(dislikeRef);
  if (likePressedCounter === 2) {
    handleLikePressedTwice();
  } else {
    handleLikePressedFirstTime();
  }
}

const handleDislikeClick = () => {
  const likeRef = db.collection("likes").doc(postId).collection("likedBy").doc(auth.currentUser.uid);;
  handleLikesAndDislikes(likeRef);

  if (dislikePressedCounter === 2) {
    handleDislikePressedTwice();

  } else {
    handleDislikePressedFirstTime();
  }

}

blogList.addEventListener("click", e => {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    handlePostDelete();

  } else if (e.target.classList.contains("like")) {
    if (!auth.currentUser) return alert("You must be logged in to like this post");
    handleLikeClick();

  } else if (e.target.classList.contains("dislike")) {
    if (!auth.currentUser) return alert("You must be logged in to dislike this post");
    handleDislikeClick();
  }
})

////reporting
const reportsRef = db.collection("reports");

reportButton.addEventListener("click", e => {
  reportsRef.doc(postId).get().then((doc) => {
    if (!doc.exists) {
      reportsRef.doc(postId).set({
        reportedId: postId
      });
    }
  }).catch((error) => {
    console.log("Error getting document");
  });


})
