const id = localStorage.getItem("id");
console.log(id);

const userRef = db.collection("users");
const profilePhoto = document.querySelector("#profilePhoto");
const myPhoto = document.querySelector(".mojaSlika");
const main = document.querySelector("main");



// blogRef.orderBy("created_at", "desc").limit(20).onSnapshot(snapshot => {
//     let changes = snapshot.docChanges().reverse();
//     changes.forEach(doc => {

//         if (doc.type == "added") {
//             renderBlogData(doc.doc);
//         } else if (doc.type == "removed") {
//             const target = document.getElementById(doc.doc.id);
//             target.nextElementSibling.remove()
//             target.remove();
//         }
//     })
// })




blogRef.where("created_by_id", "==", id).get().then(blogs => {
    // console.log(auth.currentUser.displayName);
    // const data = document.data();
    blogs.docs.forEach(blog => {
        console.log(blog.data());
        const data = blog.data();
        const created_at = data.created_at.toDate();
        const now = new Date().getTime();
        const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });

        const blogTemplate = ` <li class="blog-list-element" id=${blog.id}> 
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
        dohvatiKomentare(blog.id);
    })

    // const blogTemplate = ` <li class="blog-list-element" id=${document.id}> 
    //   <p class ="author">Written by: ${data.created_by}</p>
    //   <span>${data.title}</span>
    //   <img src="${data.picture != null ? data.picture : cat}" alt="#">
    //     <span>${data.body}</span> 
    //     <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
    //     <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
    //     <p class="commentPost">Comment this post</p>
    //     <div class='delete' >X</div>

    //     </li> 

    //     <div class ="commentSection" >
    //     <ul class="commentsDisplay"> </ul>
    //     <form class="commentForm">
    //       <input type="text" name="comment" placeholder="Your comment..." class="comment">
    //     </form>
    //     </div> `
    // blogList.insertAdjacentHTML('afterbegin', blogTemplate);
    // dohvatiKomentare(document.id);

});

userRef.doc(id).get().then(doc => {
    console.log(doc.data());
    const data = doc.data();
    const link = "cat.jpg"
    // const template = `
    // <p id="name">Your name: ${data.ime} ${data.prezime}</p>
    // <img src="${user.photoURL != null ? user.photoURL : link}" alt="#" width="250" height="250" class="mojaSlika">
    // <input type="file" value="upload" id="profilePhoto" />
    // <p id="email">Your email: ${data.email}</p>
    // <ul class="userPosts"></ul>`

    const name = document.querySelector("#name");
    const email = document.querySelector("#email");

    name.innerHTML = `Your name: ${data.ime} ${data.prezime}`;
    myPhoto.src = auth.currentUser.photoURL != null ? auth.currentUser.photoURL : link;
    email.innerHTML = `Your email: ${data.email}`;
    // main.innerHTML += template;
});

profilePhoto.addEventListener("change", e => {
    const currentUser = auth.currentUser;
    const file = e.target.files[0];
    const name = file.name;
    const metadata = {
        contentType: file.type,
    };
    const Storageref = storageDb.ref("Profile pictures/" + currentUser.uid);


    reader = new FileReader();
    reader.onload = () => {
        myPhoto.src = reader.result;
    }
    reader.readAsDataURL(file);

    Storageref.child(name).put(file, metadata).then((snapshot) => snapshot.ref.getDownloadURL()).then((link) => {
        currentUser.updateProfile({ photoURL: link }).then(function () {
            userRef.doc(currentUser.uid).update({
                slika: link
            });
            // location.reload();
        }).catch(function (error) { window.alert(error.message) });
    });


});



// photo.addEventListener("change", (e) => {
//     var currentUser = firebase.auth().currentUser;
//     const file = e.target.files[0];
//     const name = file.name;
//     const metadata = {
//         contentType: file.type,
//     };
//     const Storageref = storageDb.ref("Profile pictures/" + currentUser.uid);
//     alert("Pričekajte nekoliko trenutaka učitavanje slike profila.");

//     Storageref.child(name).put(file, metadata).then((snapshot) => snapshot.ref.getDownloadURL()).then((link) => {
//         currentUser.updateProfile({ photoURL: link }).then(function () {
//             db.ref("/users/" + currentUser.uid).update({
//                 slika: link,
//             });
//             location.reload();
//         }).catch(function (error) { window.alert(error.message) });

//     });
// });