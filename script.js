/*======================================
    AHMED HAMID ARCHITECTURE
    Main JavaScript File
======================================*/

// ==============================
// Current Year (للاستخدام لاحقًا في الفوتر)
// ==============================

const year = new Date().getFullYear();


// ==============================
// Navbar Shadow on Scroll
// ==============================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";
        header.style.background = "rgba(255,255,255,.98)";

    } else {

        header.style.boxShadow = "none";
        header.style.background = "rgba(255,255,255,.90)";

    }

});


// ==============================
// Smooth Scroll
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});


// ==============================
// Reveal Elements on Scroll
// ==============================

const revealElements = document.querySelectorAll(".hero-text, .hero-image");

const reveal = () => {

    revealElements.forEach(element => {

        const windowHeight = window.innerHeight;

        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {

            element.classList.add("active");

        }

    });

};

window.addEventListener("scroll", reveal);

reveal();


// ==============================
// Welcome Message
// ==============================

console.log("Ahmed Hamid Architecture Website Loaded Successfully.");