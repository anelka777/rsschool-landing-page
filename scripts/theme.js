const themeButtons = document.querySelectorAll('.theme-btn');

const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || 'light';

document.documentElement.dataset.theme = initialTheme;

themeButtons.forEach((button) => {
    button.setAttribute(
        'aria-pressed',
        button.dataset.theme === initialTheme
    );
});

themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;

        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);

        themeButtons.forEach((themeButton) => {
            themeButton.setAttribute(
                'aria-pressed',
                themeButton.dataset.theme === theme
            );
        });
    });
});