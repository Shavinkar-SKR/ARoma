// Smooth scrolling for anchor links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetID = this.getAttribute('href');
        if (targetID.startsWith("#")) {
            e.preventDefault();
            const target = document.querySelector(targetID);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Highlight active navigation link
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-link");
    const currentPath = window.location.pathname;

    links.forEach(link => {
        const linkPath = new URL(link.href).pathname; // Extract pathname from href
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
});