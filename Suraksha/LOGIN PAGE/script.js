const wrapper = document.querySelector('.wrapper');

const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

const loginForm = document.querySelector('.form-box.login form');


// Sign Up page open
registerLink.addEventListener('click', (event) => {
    event.preventDefault();
    wrapper.classList.add('active');
});


// Login page open
loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    wrapper.classList.remove('active');
});


// Login button pressed
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Temporary: assume login is successful
    window.location.href = '../HOME PAGE/index.html';
});


// Click outside login box → Landing Page
document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) {
        window.location.href = '../LANDING PAGE/index.html';
    }
});