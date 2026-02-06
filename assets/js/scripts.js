"use strict";

const ghProfileImage = document.getElementById("gh-profile-image");
const ghProfileUrl = document.getElementById("gh-profile-url");
const ghProfileFollowers = document.getElementById("gh-profile-followers");
const ghReposPublic = document.getElementById("gh-repos-public");

async function getGithubInfos(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar dados do Github", err);
    return null
  }
}

async function changeAboutInfos() {
  const ghProfileData = await getGithubInfos(
    `https://api.github.com/users/rayribeirost`,
  );

  if (!ghProfileData) return;

  ghProfileImage.src = ghProfileData.avatar_url;
  ghProfileImage.alt = `Foto do Perfil - ${ghProfileData.name}`;
  ghProfileUrl.href = ghProfileData.html_url;
  ghProfileFollowers.innerText = ghProfileData.followers;
  ghReposPublic.innerText = ghProfileData.public_repos;
}

changeAboutInfos();
