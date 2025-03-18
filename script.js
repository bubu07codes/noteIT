const CLIENT_ID = 1351621812768735242;
const REDIRECT_URI = "https://bubu07codes.github.io/noteIT/";
const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=1351621812768735242&response_type=code&redirect_uri=https%3A%2F%2Fbubu07codes.github.io%2FnoteIT%2F&scope=identify+email`;

function loginWithDiscord() {
    window.location.href = AUTH_URL;
}

function getUserData(token) {
    fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
        document.getElementById("username").innerText = user.username;
        document.getElementById("avatar").src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    });
}

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get("access_token");
    if (token) getUserData(token);
};

const API_URL = "https://noteit.vojtech-hajek-cz.workers.dev/";

async function loadPosts() {
    let res = await fetch(`${API_URL}/posts`);
    let posts = await res.json();
    document.getElementById("posts").innerHTML = posts.map(post =>
        `<div class="post"><strong>${post.user}</strong>: ${post.message}</div>`
    ).join("");
}

async function addPost() {
    let message = document.getElementById("message").value;
    await fetch(`${API_URL}/add-post`, {
        method: "POST",
        body: JSON.stringify({ user: "Anon", message }),
        headers: { "Content-Type": "application/json" }
    });
    loadPosts();
}