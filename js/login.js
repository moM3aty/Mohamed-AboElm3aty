document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Replace with your actual admin credentials
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
    });
});
