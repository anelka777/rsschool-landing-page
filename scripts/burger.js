const burgerBtn = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const body = document.body;

function closeMenu() {
    body.classList.remove('open');
    body.classList.remove('disable-scroll');
}

function openMenu() {
    body.classList.add('open');
    body.classList.add('disable-scroll');
}

burgerBtn.addEventListener('click', () => {
    if (body.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('open')) {
        closeMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 769 && body.classList.contains('open')) {
        closeMenu();
    }
});