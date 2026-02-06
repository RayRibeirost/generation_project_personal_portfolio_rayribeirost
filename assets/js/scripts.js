"use strict";

const ghProfileImage = document.getElementById("gh-profile-image");
const ghProfileUrl = document.getElementById("gh-profile-url");
const ghProfileFollowers = document.getElementById("gh-profile-followers");
const ghReposPublic = document.getElementById("gh-repos-public");
const swiperWrapper = document.querySelector(".swiper-wrapper");

async function getGithubInfos(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar dados do Github", err);
    return null;
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

function startSwiper() {
  new Swiper(".projects-swiper", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    centeredSlides: false,
    loop: true,
    watchOverflow: true,

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 40,
        centeredSlides: false,
      },
      769: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 40,
        centeredSlides: false,
      },
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 54,
        centeredSlides: false,
      },
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },

    grabCursor: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
  });
}

async function changeProjectInfos() {
  const ghReposData = await getGithubInfos(
    `https://api.github.com/users/rayribeirost/repos?sort=update&per_page=6`,
  );

  if (!ghReposData) return;

  swiperWrapper.innerHTML = "";
  const languages = {
    JavaScript: { icon: "javascript" },
    TypeScript: { icon: "typescript" },
    Python: { icon: "python" },
    Java: { icon: "java" },
    HTML: { icon: "html" },
    CSS: { icon: "css" },
    PHP: { icon: "php" },
    "C#": { icon: "csharp" },
    Go: { icon: "go" },
    Kotlin: { icon: "kotlin" },
    Swift: { icon: "swift" },
    GitHub: { icon: "github" },
  };

  ghReposData.forEach((repo) => {
    const showLanguage = repo.language || "Github";
    const config = languages[repo.language] || { icon: "github" };
    const urlIcon = `./assets/icons/languages/${config.icon}.svg`;
    const formatedName = repo.name
      .replace(/[-_]/g, " ")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toUpperCase();
    const description = repo.description
      ? repo.description.length > 100
        ? repo.description.substring(0, 97) + "..."
        : repo.description
      : "Projeto Desenvolvido no GitHub";
    const tags =
      repo.topics?.length > 0
        ? repo.topics
            .sclice(0, 3)
            .map((topic) => `<span class="tag">${topic}</span>`)
            .join("")
        : `<span class="tag">${showLanguage}</span>`;
    const actionButtons = `
        <div class="project-buttons">
                    <a href="${repo.html_url}" target="_blank" class="botao botao-sm">
                        GitHub
                    </a>
                    ${
                      repo.homepage
                        ? `
                        <a href="${repo.homepage}" target="_blank" class="botao-outline botao-sm">
                            Deploy
                        </a>
                    `
                        : ""
                    }
                </div>
    `;
    swiperWrapper.innerHTML += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlIcon}" 
                                alt="Ícone ${showLanguage}"
                                onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
                        </div>

                        <div class="project-content">
                            <h3>${formatedName}</h3>
                            <p>${description}</p>
                            <div class="project-tags">${tags}</div>
                            ${actionButtons}
                        </div>
                    </article>
                </div>
            `;
  });
  startSwiper();
}

changeAboutInfos();
changeProjectInfos();
