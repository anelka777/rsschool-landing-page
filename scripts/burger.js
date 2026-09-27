const burgerBtn = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const body = document.body;

burgerBtn.addEventListener('click', () => {
    body.classList.toggle('open');
    body.classList.toggle('disable-scroll');
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        body.classList.remove('open');
        body.classList.remove('disable-scroll');
    });
});