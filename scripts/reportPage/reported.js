
const reportsRef = db.collection("reports");
const blogRef = db.collection("blogs");
const blogList = document.querySelector("#blog-list");

reportsRef.get().then((doc) => {

    doc.forEach(item => {
        const data = item.data();
        blogRef.doc(data.reportedId).get().then(data => {
            renderBlogData(data, 'afterbegin');
        })

    })

}).catch((error) => {
    console.log("Error getting document", error);
});



// const blogList = document.querySelector("#blog-list");
const handleDelete = (id) => {

    const target = document.getElementById(id);
    // target.nextElementSibling.remove();
    target.remove();
    blogRef.doc(id).delete();
    reportsRef.doc(id).delete();
};

const handleOkPost = (id) => {
    const target = document.getElementById(id);
    target.remove();
    reportsRef.doc(id).delete();
};
// brisanje
blogList.addEventListener("click", e => {
    e.preventDefault();
    const id = e.target.parentElement.getAttribute("id");
    if (e.target.classList.contains("deleteReportedPost")) {
        handleDelete(id);
    } else if (e.target.classList.contains("okPost")) {
        handleOkPost(id);
    }
})

//mozda u posebni file posto koristi i zajdnicki i ovaj
const toggleHamburgerButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector("#nav-links");


toggleHamburgerButton.addEventListener("click", e => {
    navLinks.classList.toggle("active");
})
// blogRef.orderBy('title_search').orderBy("created_at", "desc").startAt(term).endAt(term + '~').get().then(data => {
//     let changes = data.docChanges().reverse();
//     changes.forEach(blog => {

//         renderBlogData(blog.doc, 'afterbegin');

//     })
// });