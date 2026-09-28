const sliderContainer = document.querySelector('.fav-coffee-slider-container');
const sliderRow = document.querySelector('.fav-slider-row');
const arrowLeft = document.querySelector('.fav-coffee-slider-container .left');
const arrowRight = document.querySelector('.fav-coffee-slider-container .right');
const dots = document.querySelectorAll('.controls .control');

const SLIDE_DURATION = 5000;
const STEP = 100;
const STEP_PERCENT = (STEP / SLIDE_DURATION) * 100;

let currentSlide = 0;
let currentProgress = 0;
let progressIntervalId = null;

function updateSlider() {
    const offset = -currentSlide * 100 + '%';
    sliderRow.style.transform = `translateX(${offset})`;
}

function setActiveDot() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function resetIndicators() {
    dots.forEach(dot => {
        dot.querySelector('.control_indicator').style.width = '0%';
    });
    currentProgress = 0;
}

function startProgress() {
    clearInterval(progressIntervalId);
    const indicator = dots[currentSlide].querySelector('.control_indicator');

    progressIntervalId = setInterval(() => {
        currentProgress += STEP_PERCENT;

        if (currentProgress >= 100) {
            currentProgress = 100;
            indicator.style.width = '100%';
            clearInterval(progressIntervalId);
            nextSlide();
        } else {
            indicator.style.width = currentProgress + '%';
        }
    }, STEP);
}

function pauseProgress() {
    clearInterval(progressIntervalId);
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    setActiveDot();
    resetIndicators();
    startProgress();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % dots.length);
}

function previousSlide() {
    goToSlide((currentSlide - 1 + dots.length) % dots.length);
}

arrowRight.addEventListener('click', nextSlide);
arrowLeft.addEventListener('click', previousSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

sliderContainer.addEventListener('mouseenter', pauseProgress);
sliderContainer.addEventListener('mouseleave', startProgress);

setActiveDot();
startProgress();