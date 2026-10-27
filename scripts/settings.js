(function () {
  const app = window.TikTokApp || {};
  const state = window.appState;
  const api = app.api;

  const dom = {
    profileContent: document.getElementById('profileContent')
  };

  function getProfileUser() {
    return api.getUser(state.currentUserId);
  }

  function openVideo(videoId) {
    app.setActiveTab('feedTab');
    const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
    if (videoCard) {
      videoCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderProfileGrid(videos) {
    if (!videos.length) {
      return '<div class="empty-state">Nenhum vídeo para mostrar.</div>';
    }

    return `
      <div class="profile-grid">
        ${videos.map((video) => `
          <button class="profile-video" data-profile-video="${video.id}" aria-label="Abrir vídeo ${video.title}">
            <img src="${video.src}" alt="${video.title}" />
            <span class="video-play">▶</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function render() {
    const user = getProfileUser();
    const userVideos = state.videos.filter((video) => video.userId === user.id);
    const likedVideos = state.videos.filter((video) => video.likedBy.includes(user.id));

    let activeTab = 'videos';
    const tabButton = document.querySelector('.tab-btn.active');
    if (tabButton) {
      activeTab = tabButton.dataset.tab || 'videos';
    }

    dom.profileContent.innerHTML = `
      <div class="profile-card">
        <div class="profile-top">
          <img class="profile-avatar" src="${user.avatar}" alt="${user.name}" />
          <div class="profile-identity">
            <h3>${user.name}</h3>
            <p class="profile-handle">${user.username}</p>
          </div>
        </div>
        <p class="profile-bio">${user.bio}</p>
        <div class="profile-stats">
          <div class="stat-box">
            <strong>${api.formatNumber(user.following)}</strong>
            <span>Seguindo</span>
          </div>
          <div class="stat-box">
            <strong>${api.formatNumber(user.followers)}</strong>
            <span>Seguidores</span>
          </div>
          <div class="stat-box">
            <strong>${api.formatNumber(user.likes)}</strong>
            <span>Curtidas</span>
          </div>
        </div>
      </div>

      <div class="profile-tabs">
        <button class="tab-btn ${activeTab === 'videos' ? 'active' : ''}" data-tab="videos">Vídeos</button>
        <button class="tab-btn ${activeTab === 'liked' ? 'active' : ''}" data-tab="liked">Curtidos</button>
      </div>

      ${activeTab === 'videos' ? renderProfileGrid(userVideos) : renderProfileGrid(likedVideos)}
    `;

    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        render();
      });
    });

    document.querySelectorAll('[data-profile-video]').forEach((button) => {
      button.addEventListener('click', () => {
        openVideo(button.dataset.profileVideo);
      });
    });
  }

  function init() {
    render();
  }

  app.profile = app.profile || {};
  app.profile.init = init;
  app.profile.render = render;
})(window);
