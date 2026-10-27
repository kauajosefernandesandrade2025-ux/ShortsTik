(function () {
  const app = window.TikTokApp || {};
  const state = window.appState;
  const api = app.api;

  const dom = {
    feedList: document.getElementById('feedList'),
    commentSheet: document.getElementById('commentSheet'),
    commentList: document.getElementById('commentList')
  };

  function formatTags(tags) {
    return tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  }

  function renderComments(videoId) {
    const video = api.getVideo(videoId);
    if (!video) return;

    if (!video.comments.length) {
      dom.commentList.innerHTML = '<p class="empty-state" style="padding: 0.75rem 0;">Nenhum comentário ainda. Seja o primeiro!</p>';
      return;
    }

    dom.commentList.innerHTML = video.comments.map((comment) => `
      <li class="comment-item">
        <img class="comment-avatar" src="${comment.avatar}" alt="${comment.user}" />
        <div>
          <div class="comment-meta">
            <strong>${comment.user}</strong>
          </div>
          <p>${comment.text}</p>
        </div>
      </li>
    `).join('');
  }

  function toggleLike(videoId) {
    const currentUserId = state.currentUserId;
    const video = api.getVideo(videoId);
    if (!video) return;

    const isLiked = video.likedBy.includes(currentUserId);
    if (isLiked) {
      video.likedBy = video.likedBy.filter((id) => id !== currentUserId);
      video.likes = Math.max(0, video.likes - 1);
    } else {
      video.likedBy.push(currentUserId);
      video.likes += 1;
    }

    render();
  }

  function openSheetForVideo(videoId) {
    app.openCommentSheet(videoId);
  }

  function render() {
    if (!dom.feedList) return;

    dom.feedList.innerHTML = state.videos.map((video) => {
      const user = api.getUser(video.userId);
      const isLiked = video.likedBy.includes(state.currentUserId);
      const commentCount = video.comments.length;

      return `
        <article class="video-card" data-video-id="${video.id}">
          <video
            class="video-surface"
            muted
            loop
            playsinline
            preload="metadata"
            data-video-id="${video.id}"
            src="${video.src}"
          ></video>
          <div class="video-overlay"></div>
          <div class="video-side-actions">
            <div class="action-pill">
              <button class="action-btn ${isLiked ? 'liked' : ''}" data-like-id="${video.id}" aria-label="Curtir vídeo">♥</button>
              <span class="action-count">${api.formatNumber(video.likes)}</span>
            </div>
            <div class="action-pill">
              <button class="action-btn" data-comment-id="${video.id}" aria-label="Comentários">💬</button>
              <span class="action-count">${commentCount}</span>
            </div>
          </div>
          <div class="video-info">
            <div class="author-row">
              <img class="author-avatar" src="${user.avatar}" alt="${user.name}" />
              <span class="author-user-tag">${user.username}</span>
            </div>
            <h3 class="video-title">${video.title}</h3>
            <p class="video-description">${video.description}</p>
            <div class="video-tags">${formatTags(video.tags)}</div>
          </div>
        </article>
      `;
    }).join('');

    bindFeedEvents();
    initAutoplay();
  }

  function bindFeedEvents() {
    document.querySelectorAll('[data-like-id]').forEach((button) => {
      button.addEventListener('click', () => {
        toggleLike(button.dataset.likeId);
      });
    });

    document.querySelectorAll('[data-comment-id]').forEach((button) => {
      button.addEventListener('click', () => {
        openSheetForVideo(button.dataset.commentId);
      });
    });
  }

  function initAutoplay() {
    const cards = Array.from(document.querySelectorAll('.video-card'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, {
      root: dom.feedList,
      threshold: 0.7
    });

    cards.forEach((card) => observer.observe(card));
  }

  function init() {
    render();
  }

  app.feed = app.feed || {};
  app.feed.init = init;
  app.feed.render = render;
  app.feed.renderComments = renderComments;
  app.feed.toggleLike = toggleLike;
})(window);
