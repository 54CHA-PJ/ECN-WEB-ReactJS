function validateForm(event) {
    var username = document.getElementById('login').value;
    var password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'home.html';
    } else {
        alert('Invalid username or password');
    }

    event.preventDefault(); // Prevent the form from submitting
}