(function () {
  const app = window.TikTokApp || {};
  const state = window.appState;
  const api = app.api;

  const dom = {
    searchInput: document.getElementById('searchInput'),
    trendingTags: document.getElementById('trendingTags'),
    results: document.getElementById('searchResults')
  };

  function trendingList() {
    return ['#travel', '#fitness', '#food', '#music', '#vibes', '#design'];
  }

  function getSearchMatches(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [];
    }

    const userMatches = state.users.filter((user) => {
      const haystack = `${user.name} ${user.username} ${user.bio}`.toLowerCase();
      return haystack.includes(q);
    });

    const videoMatches = state.videos.filter((video) => {
      const user = api.getUser(video.userId);
      const haystack = `${video.title} ${video.description} ${video.tags.join(' ')} ${user.username}`.toLowerCase();
      return haystack.includes(q);
    });

    return {
      users: userMatches,
      videos: videoMatches
    };
  }

  function renderTrending() {
    dom.trendingTags.innerHTML = trendingList().map((tag) => `
      <button class="trend-tag" data-trend="${tag}">${tag}</button>
    `).join('');

    dom.trendingTags.querySelectorAll('[data-trend]').forEach((button) => {
      button.addEventListener('click', () => {
        dom.searchInput.value = button.dataset.trend;
        render();
      });
    });
  }

  function render() {
    const query = dom.searchInput.value.trim();
    const matches = getSearchMatches(query);

    if (!query) {
      dom.results.innerHTML = `
        <div class="search-grid">
          ${state.videos.slice(0, 4).map((video) => {
            const user = api.getUser(video.userId);
            return `
              <article class="search-video-item" data-open-video="${video.id}">
                <video muted playsinline preload="metadata" src="${video.src}"></video>
                <div class="search-video-meta">
                  <strong>${video.title}</strong>
                  <span>${user.username}</span>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `;

      dom.results.querySelectorAll('[data-open-video]').forEach((card) => {
        card.addEventListener('click', () => {
          app.setActiveTab('feedTab');
          const video = api.getVideo(card.dataset.openVideo);
          const cardEl = document.querySelector(`[data-video-id="${video.id}"]`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
      return;
    }

    const userResults = matches.users.map((user) => `
      <article class="result-card" tabindex="0">
        <img class="result-avatar" src="${user.avatar}" alt="${user.name}" />
        <div class="result-text">
          <p class="result-title">${user.username}</p>
          <p class="result-subtitle">${user.name}</p>
        </div>
        <span class="result-badge">User</span>
      </article>
    `).join('');

    const videoResults = matches.videos.map((video) => {
      const user = api.getUser(video.userId);
      return `
        <article class="result-card" data-open-video="${video.id}" tabindex="0">
          <img class="result-avatar" src="${user.avatar}" alt="${video.title}" />
          <div class="result-text">
            <p class="result-title">${video.title}</p>
            <p class="result-subtitle">${user.username} • ${video.tags.join(' ')}</p>
          </div>
          <span class="result-badge">Vídeo</span>
        </article>
      `;
    }).join('');

    dom.results.innerHTML = (userResults || videoResults)
      ? `${userResults}${videoResults}`
      : '<div class="empty-state">Nenhum resultado encontrado para sua busca.</div>';

    dom.results.querySelectorAll('[data-open-video]').forEach((card) => {
      card.addEventListener('click', () => {
        app.setActiveTab('feedTab');
        const video = api.getVideo(card.dataset.openVideo);
        const cardEl = document.querySelector(`[data-video-id="${video.id}"]`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function init() {
    renderTrending();
    dom.searchInput.addEventListener('input', render);
    render();
  }

  app.search = app.search || {};
  app.search.init = init;
  app.search.render = render;
})(window);
