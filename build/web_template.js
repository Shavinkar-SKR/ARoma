// Smooth scrolling for anchor links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.hash !== "") {
            e.preventDefault();
            const target = document.querySelector(this.hash);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});