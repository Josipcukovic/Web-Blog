const buttonNewBlog = document.querySelector("#newBlog");
const wrapper = document.querySelector(".wrapper");
const popup = document.querySelectorAll(".popUp");

const buttonLogin = document.querySelector("#login");
const buttonRegister = document.querySelector("#register");

const wrapperRegister = document.querySelector(".wrapper-register");
const wrapperLogin = document.querySelector(".wrapper-login");



const inputForPostImage = document.querySelector("#selectImage");

inputForPostImage.addEventListener("click", e => {
    var input = document.createElement("input");
    input.type = "file";
    input.click();

    input.onchange = e => {
        handleBlogPicture(e);
    }
})


buttonNewBlog.addEventListener("click", (e) => {
    wrapper.style.display = "block";
    //declared in auth.js
    if (wrapperLogin) {
        wrapperLogin.style.display = "none";
    }
    if (wrapperRegister) {
        wrapperRegister.style.display = "none";
    }


});

wrapper.addEventListener("click", (e) => {
    if (e.target.className != "content") {
        wrapper.style.display = "none";

    }
});

popup.forEach(popup => {
    popup.addEventListener("click", (e) => {
        e.stopPropagation();
    });
})

//login
buttonLogin.addEventListener("click", (e) => {
    wrapperLogin.style.display = "block";
    wrapper.style.display = "none";
    wrapperRegister.style.display = "none";
});
if (wrapperLogin) {
    wrapperLogin.addEventListener("click", (e) => {
        if (e.target.className != "content") {
            wrapperLogin.style.display = "none";
        }
    });
}


//register

buttonRegister.addEventListener("click", (e) => {
    wrapperRegister.style.display = "block";
    wrapperLogin.style.display = "none";
    wrapper.style.display = "none";
});

if (wrapperRegister) {
    wrapperRegister.addEventListener("click", (e) => {
        if (e.target.className != "content") {
            wrapperRegister.style.display = "none";
        }
    });
}



const toggleHamburgerButton = document.querySelector(".toggle-button");
const navLinks = document.querySelector("#nav-links");
const searchBoxy = document.querySelector(".searchForm");

toggleHamburgerButton.addEventListener("click", e => {
    navLinks.classList.toggle("active");
    if (searchBoxy) {
        searchBoxy.classList.toggle("active");
    }
    toggleHamburgerButton.classList.toggle("open");
})