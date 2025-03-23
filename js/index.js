// index.js

const baseUrl = "https://api.github.com";
const headers = {
  "Accept": "application/vnd.github.v3+json"
};

// DOM Elements
const form = document.getElementById("github-form");
const searchInput = document.getElementById("search");
const userList = document.getElementById("user-list");
const repoList = document.getElementById("repo-list");

// Search users on form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetch(`${baseUrl}/search/users?q=${encodeURIComponent(query)}`, { headers })
      .then(response => {
        if (!response.ok) throw new Error("Rate limit exceeded or bad request");
        return response.json();
      })
      .then(data => {
        displayUsers(data.items);
        repoList.innerHTML = ""; // Clear repos on new search
      })
      .catch(error => console.error("Error searching users:", error));
    searchInput.value = ""; // Clear input
  }
});

// Display user search results
function displayUsers(users) {
  userList.innerHTML = ""; // Clear previous results
  users.forEach(user => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}">
      <span>${user.login}</span>
      <a href="${user.html_url}" target="_blank">Profile</a>
    `;
    li.addEventListener("click", () => fetchRepos(user.login));
    userList.appendChild(li);
  });
}

// Fetch and display repositories for a user
function fetchRepos(username) {
  fetch(`${baseUrl}/users/${username}/repos`, { headers })
    .then(response => {
      if (!response.ok) throw new Error("Rate limit exceeded or bad request");
      return response.json();
    })
    .then(repos => displayRepos(repos))
    .catch(error => console.error("Error fetching repos:", error));
}

function displayRepos(repos) {
  repoList.innerHTML = ""; // Clear previous repos
  repos.forEach(repo => {
    const li = document.createElement("li");
    li.textContent = `${repo.name} - ${repo.description || "No description"}`;
    repoList.appendChild(li);
  });
}