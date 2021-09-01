var lastVisible;
var next;
let userUsedSearchForm = false;

const setPostsStartingPoint = (snapshot) => {
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    next = blogRef
        .orderBy("created_at", "desc")
        .startAfter(lastVisible)
        .limit(5);
}

const getNextFivePosts = () => {
    if (!userUsedSearchForm) {
        next.get().then(snapshot => {

            setPostsStartingPoint(snapshot);

            snapshot.forEach(item => {

                renderBlogData(item, 'beforeend', "index");
            })
        }).catch(e => {
            document.querySelector(".noMorePostsMessage").style.display = "block";
        })
    }

}

///show more data on scroll
window.onscroll = function () {
    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight + 16) {
        getNextFivePosts();
    }
};

const getSearchedPosts = (term) => {
    blogRef.orderBy('title_search').orderBy("created_at", "desc").startAt(term).endAt(term + '~').get().then(data => {
        let changes = data.docChanges().reverse();
        changes.forEach(blog => {
            renderBlogData(blog.doc, 'afterbegin', "index");
        })
    });
}

///search for posts
const searchForm = document.querySelector(".searchForm");
searchForm.addEventListener("submit", e => {
    e.preventDefault();
    userUsedSearchForm = true;
    let term = searchForm["searchBox"].value.toLowerCase().trim();
    if (!term.trim()) {
        return;
    } else {
        blogList.innerHTML = "";
    }
    getSearchedPosts(term);
})


//rendering post data
blogRef.orderBy("created_at", "desc").limit(5).get().then(snapshot => {
    let changes = snapshot.docChanges().reverse();
    setPostsStartingPoint(snapshot);

    changes.forEach(doc => {
        if (doc.type == "added") {
            renderBlogData(doc.doc, 'afterbegin');
        }
    })
})

const deletePost = (postId) => {
    const target = document.getElementById(postId);
    target.nextElementSibling.remove();
    target.remove();
    blogRef.doc(postId).delete();
}

const showPostDetails = (postId) => {
    localStorage.setItem("postId", postId);
    window.location.href = "pages/blogDetails.html";
}
///brisanje objava i dodavanje komentara
blogList.addEventListener("click", e => {
    e.preventDefault();
    const postId = e.target.parentElement.getAttribute("id");

    if (e.target.classList.contains("delete")) {
        deletePost(postId);

    } else if (e.target.classList.contains("prikaziBlog")) {
        showPostDetails(postId);

    } else if (e.target.classList.contains("prikaziBlogChildren")) {
        const postId = e.target.parentElement.parentElement.getAttribute("id");
        showPostDetails(postId);
    }
})


const myProfileLink = document.querySelector(".myProfile");
const openUserProfile = () => {
    localStorage.setItem("userId", auth.currentUser.uid);
    window.location.href = "../pages/myProfile.html";
}

myProfileLink.addEventListener("click", e => {
    openUserProfile();
});

