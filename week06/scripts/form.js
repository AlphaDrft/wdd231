const params = new URLSearchParams(window.location.search);
const userName = params.get('username');
const userNamePlaceholder = document.getElementById('user-name-placeholder');
if (userName) {
    userNamePlaceholder.textContent = userName;
}