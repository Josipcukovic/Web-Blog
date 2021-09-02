const userId = localStorage.getItem("userId");

const userRef = db.collection("users");
const myPhoto = document.querySelector(".profile-picture");


blogRef.where("created_by_id", "==", userId).orderBy("created_at", "asc").get().then(blogs => {
    blogs.docs.forEach(blog => {
        renderBlogData(blog, 'afterbegin', 'myProfile');
    })
});

userRef.doc(userId).get().then(doc => {
    const data = doc.data();
    const defaultPicture = "../img/userPic.png"
    const name = document.querySelector("#name");
    const email = document.querySelector("#email");

    name.innerHTML = `Your name: ${data.ime} ${data.prezime}`;
    myPhoto.src = auth.currentUser.photoURL != null ? auth.currentUser.photoURL : defaultPicture;
    email.innerHTML = `Your email: ${data.email}`;
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

const handlePostDelete = (postId) => {
    const target = document.getElementById(postId);
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this post!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                target.nextElementSibling.remove();
                target.remove();
                blogRef.doc(postId).delete();
                swal("Your post has been deleted!", {
                    icon: "success",
                });
            }
        });



}

blogList.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
        const postId = e.target.parentElement.getAttribute("id");
        handlePostDelete(postId);
    }
})