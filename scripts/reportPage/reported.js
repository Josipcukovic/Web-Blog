
const reportsRef = db.collection("reports");
const blogRef = db.collection("blogs");
const blogList = document.querySelector("#blog-list");

reportsRef.get().then((doc) => {

    doc.forEach(item => {
        const data = item.data();
        blogRef.doc(data.reportedId).get().then(data => {
            renderBlogData(data, 'afterbegin', "reportedStuff");
        })

    })

}).catch((error) => {
    console.log("Error getting document", error);
});


const handleDelete = (postId) => {
    const target = document.getElementById(postId);
    target.remove();
    blogRef.doc(postId).delete();
    reportsRef.doc(postId).delete();
};

const handleOkPost = (postId) => {
    const target = document.getElementById(postId);
    target.remove();
    reportsRef.doc(postId).delete();
};

blogList.addEventListener("click", e => {
    e.preventDefault();
    const postId = e.target.parentElement.getAttribute("id");
    if (e.target.classList.contains("deleteReportedPost")) {
        handleDelete(postId);
    } else if (e.target.classList.contains("okPost")) {
        handleOkPost(postId);
    }
})

const toggleHamburgerButton = document.querySelector(".toggle-button");



toggleHamburgerButton.addEventListener("click", e => {
    navLinks.classList.toggle("active");
    toggleHamburgerButton.classList.toggle("open");
})
