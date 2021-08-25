const id = localStorage.getItem("id");
console.log(id);

const userRef = db.collection("users");
const profilePhoto = document.querySelector("#profilePhoto");
const myPhoto = document.querySelector(".mojaSlika");
const main = document.querySelector("main");

blogRef.where("created_by_id", "==", id).orderBy("created_at", "asc").get().then(blogs => {
    // console.log(auth.currentUser.displayName);
    // const data = document.data();
    blogs.docs.forEach(blog => {
        console.log(blog.data());
        const data = blog.data();
        const created_at = data.created_at.toDate();
        const now = new Date().getTime();
        const timeAgo = dateFns.distanceInWords(now, created_at.getTime(), { addSuffix: true });

        const blogTemplate = ` <li class="blog-list-element" id=${blog.id}> 
       
          <span>${data.title}</span>
          <img src="${data.picture != null ? data.picture : cat}" alt="#" class="blogPicture">
            <span class="dataBody">${data.body}</span> 
            <div class = "tooltip"> ${created_at.toLocaleDateString()} at ${created_at.toLocaleTimeString()} </div>
            <p class="createdAt" onmouseover="toggleTimeCreated()" onmouseleave="toggleTimeCreated()"> ${timeAgo} </p> 
            <p class="commentPost">Comment this post</p>
            <div class='delete' >X</div>

            </li> 

            <div class ="commentSection" >
            <form class="commentForm">
              <input type="text" name="comment" placeholder="Your comment..." class="comment">
            </form>
            <ul class="commentsDisplay"> </ul>
            </div> `
        blogList.insertAdjacentHTML('afterbegin', blogTemplate);
        dohvatiKomentare(blog.id);
    })


});

userRef.doc(id).get().then(doc => {
    console.log(doc.data());
    const data = doc.data();
    const link = "cat.jpg"
    const name = document.querySelector("#name");
    const email = document.querySelector("#email");

    name.innerHTML = `Your name: ${data.ime} ${data.prezime}`;
    myPhoto.src = auth.currentUser.photoURL != null ? auth.currentUser.photoURL : link;
    email.innerHTML = `Your email: ${data.email}`;
    // main.innerHTML += template;
});


const changeProfilePictureButton = document.querySelector("#selectProfileImage");

changeProfilePictureButton.addEventListener("click", e => {
    var input = document.createElement("input");
    input.type = "file";
    input.click();

    input.onchange = e => {
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

    }
})

// profilePhoto.addEventListener("change", e => {
//     const currentUser = auth.currentUser;
//     const file = e.target.files[0];
//     const name = file.name;
//     const metadata = {
//         contentType: file.type,
//     };
//     const Storageref = storageDb.ref("Profile pictures/" + currentUser.uid);


//     reader = new FileReader();
//     reader.onload = () => {
//         myPhoto.src = reader.result;
//     }
//     reader.readAsDataURL(file);

//     Storageref.child(name).put(file, metadata).then((snapshot) => snapshot.ref.getDownloadURL()).then((link) => {
//         currentUser.updateProfile({ photoURL: link }).then(function () {
//             userRef.doc(currentUser.uid).update({
//                 slika: link
//             });
//             // location.reload();
//         }).catch(function (error) { window.alert(error.message) });
//     });


// });



//deleting blogs logic, declared in zajednicki.js


blogList.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.getAttribute("id");
        const target = document.getElementById(id);
        target.nextElementSibling.remove();
        target.remove();
        blogRef.doc(id).delete();
    }
})