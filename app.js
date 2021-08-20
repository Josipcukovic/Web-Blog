var lastVisible;
var next;

///show more data on scroll
window.onscroll = function (ev) {

    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight + 16) {
        console.log("tu");
        next.get().then(snapshot => {
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            next = blogRef
                .orderBy("created_at", "desc")
                .startAfter(lastVisible)
                .limit(5);
            console.log(lastVisible);
            snapshot.forEach(item => {

                renderBlogData(item, 'beforeend');
            })
        }).catch(e => {
            document.querySelector(".noMorePostsMessage").style.display = "block";
        })

    }
};


///search for posts
const searchBox = document.querySelector(".trazilica");
searchBox.addEventListener("submit", e => {
    e.preventDefault();

    let term = searchBox["searchBox"].value.toLowerCase().trim();
    if (!term.trim()) {
        return;
    } else {
        blogList.innerHTML = "";
    }
    blogRef.orderBy('title_search').orderBy("created_at", "desc").startAt(term).endAt(term + '~').get().then(data => {
        let changes = data.docChanges().reverse();
        changes.forEach(blog => {

            renderBlogData(blog.doc, 'afterbegin');

        })
    });
})


// })
////listener
blogRef.orderBy("created_at", "desc").limit(5).get().then(snapshot => {
    let changes = snapshot.docChanges().reverse();

    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    next = blogRef
        .orderBy("created_at", "desc")
        .startAfter(lastVisible)
        .limit(3);

    changes.forEach(doc => {

        if (doc.type == "added") {
            renderBlogData(doc.doc, 'afterbegin');

        }
    })
})

///brisanje i dodavanje komentara
blogList.addEventListener("click", e => {
    e.preventDefault();

    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.getAttribute("id");
        const target = document.getElementById(id);
        target.nextElementSibling.remove();
        target.remove();
        blogRef.doc(id).delete();

    } else if (e.target.classList.contains("prikaziBlog")) {
        const id = e.target.parentElement.getAttribute("id");
        console.log(e.target);
        localStorage.setItem("id", id);
        window.location.href = "blogDetails.html";
    } else if (e.target.classList.contains("prikaziBlogChildren")) {
        const id = e.target.parentElement.parentElement.getAttribute("id");
        console.log(e.target);
        localStorage.setItem("id", id);
        window.location.href = "blogDetails.html";
    }
})


const link = document.querySelector(".myProfile");

link.addEventListener("click", e => {
    console.log(e.target);
    localStorage.setItem("id", auth.currentUser.uid);
    window.location.href = "myProfile.html";
});

