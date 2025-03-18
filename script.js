const CLIENT_ID = 1351621812768735242;
const REDIRECT_URI = "https://bubu07codes.github.io/noteIT/";
const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=1351621812768735242&response_type=code&redirect_uri=https%3A%2F%2Fbubu07codes.github.io%2FnoteIT%2F&scope=identify+email`;

const API_URL = "https://noteit.vojtech-hajek-cz.workers.dev/";

function loginWithDiscord() {
	window.location.href = AUTH_URL;
}

function getUserData(token) {
	fetch("https://discord.com/api/users/@me", {
		headers: { Authorization: `Bearer ${token}` }
	})
	.then(res => res.json())
	.then(user => {
		document.getElementById("user-info").innerHTML = `
			<img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" width="40">
			<strong>${user.username}</strong>
		`;
		localStorage.setItem("user", JSON.stringify(user));
	});
}

window.onload = () => {
	const urlParams = new URLSearchParams(window.location.hash.substring(1));
	const token = urlParams.get("access_token");
	if (token) getUserData(token);
	loadPosts();
};

async function loadPosts() {
	let res = await fetch(`${API_URL}/posts`);
	let posts = await res.json();
	document.getElementById("posts").innerHTML = posts.map(post =>
		`<div class="post">
			<strong>${post.user}</strong>: ${post.message} 
			<button onclick="likePost('${post.id}')">❤️ ${post.likes}</button>
		</div>`
	).join("");
}

async function createPost() {
	let message = document.getElementById("message").value;
	let user = JSON.parse(localStorage.getItem("user"));
	if (!message.trim() || !user) return alert("Login and write a message!");

	await fetch(`${API_URL}/add-post`, {
		method: "POST",
		body: JSON.stringify({ user: user.username, message }),
		headers: { "Content-Type": "application/json" }
	});
	document.getElementById("message").value = "";
	loadPosts();
}

async function likePost(postId) {
	await fetch(`${API_URL}/like-post/${postId}`, { method: "POST" });
	loadPosts();
}