
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



// blogRef.orderBy('title_search').orderBy("created_at", "desc").startAt(term).endAt(term + '~').get().then(data => {
//     let changes = data.docChanges().reverse();
//     changes.forEach(blog => {

//         renderBlogData(blog.doc, 'afterbegin');

//     })
// });