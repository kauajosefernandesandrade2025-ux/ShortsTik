(function () {
  const app = window.TikTokApp || {};
  const state = window.appState;

  const dom = {
    navItems: Array.from(document.querySelectorAll('.nav-item[data-target]')),
    panels: Array.from(document.querySelectorAll('.tab-panel')),
    publishBtn: document.getElementById('publishBtn'),
    uploadModal: document.getElementById('uploadModal'),
    closeUploadModal: document.getElementById('closeUploadModal'),
    uploadForm: document.getElementById('uploadForm'),
    uploadTitleInput: document.getElementById('uploadTitleInput'),
    uploadUrlInput: document.getElementById('uploadUrlInput'),
    commentSheet: document.getElementById('commentSheet'),
    closeCommentSheet: document.getElementById('closeCommentSheet'),
    commentForm: document.getElementById('commentForm'),
    commentInput: document.getElementById('commentInput'),
    commentList: document.getElementById('commentList')
  };

  function setActiveTab(tabName) {
    state.activeTab = tabName;
    dom.panels.forEach((panel) => {
      const isActive = panel.id === tabName;
      panel.classList.toggle('active', isActive);
    });

    dom.navItems.forEach((button) => {
      const isActive = button.dataset.target === tabName;
      button.classList.toggle('active', isActive);
    });
  }

  function applyTheme(themeName = state.theme) {
    state.theme = themeName;
    document.body.setAttribute('data-theme', themeName);
    const themeToggle = document.querySelector('#themeToggle');
    if (themeToggle) {
      themeToggle.classList.toggle('on', themeName === 'light');
      themeToggle.setAttribute('aria-checked', String(themeName === 'light'));
    }
  }

  function openModal() {
    dom.uploadModal.classList.remove('hidden');
    dom.uploadModal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    dom.uploadModal.classList.add('hidden');
    dom.uploadModal.setAttribute('aria-hidden', 'true');
    dom.uploadForm.reset();
  }

  function openCommentSheet(videoId) {
    state.activeCommentVideoId = videoId;
    dom.commentSheet.classList.remove('hidden');
    dom.commentSheet.setAttribute('aria-hidden', 'false');
    app.feed.renderComments(videoId);
  }

  function closeCommentSheet() {
    dom.commentSheet.classList.add('hidden');
    dom.commentSheet.setAttribute('aria-hidden', 'true');
    state.activeCommentVideoId = null;
  }

  function handleUpload(event) {
    event.preventDefault();
    const title = dom.uploadTitleInput.value.trim();
    const url = dom.uploadUrlInput.value.trim();
    if (!title || !url) return;

    const currentUser = app.api.getCurrentUser();
    const newVideo = {
      id: `v_${Date.now()}`,
      userId: currentUser.id,
      title,
      description: 'Vídeo compartilhado por você recentemente.',
      tags: ['#meuvideo', '#novo', '#shorts'],
      likes: 0,
      likedBy: [],
      comments: [],
      src: url
    };

    state.videos.unshift(newVideo);
    closeModal();
    app.feed.render();
    app.search.render();
    app.profile.render();
    setActiveTab('feedTab');
  }

  function handleCommentSubmit(event) {
    event.preventDefault();
    const videoId = state.activeCommentVideoId;
    if (!videoId) return;

    const text = dom.commentInput.value.trim();
    if (!text) return;

    const currentUser = app.api.getCurrentUser();
    const video = app.api.getVideo(videoId);
    if (!video) return;

    video.comments.push({
      id: `c_${Date.now()}`,
      user: currentUser.username,
      avatar: currentUser.avatar,
      text
    });

    dom.commentForm.reset();
    app.feed.renderComments(videoId);
    app.feed.render();
  }

  function bindUi() {
    dom.navItems.forEach((button) => {
      button.addEventListener('click', () => {
        setActiveTab(button.dataset.target);
      });
    });

    dom.publishBtn.addEventListener('click', openModal);
    dom.closeUploadModal.addEventListener('click', closeModal);
    document.querySelector('[data-close-modal="true"]').addEventListener('click', closeModal);
    dom.uploadForm.addEventListener('submit', handleUpload);
    dom.closeCommentSheet.addEventListener('click', closeCommentSheet);
    dom.commentForm.addEventListener('submit', handleCommentSubmit);
  }

  function init() {
    bindUi();
    applyTheme(state.theme);
    setActiveTab(state.activeTab);

    if (app.feed && typeof app.feed.init === 'function') {
      app.feed.init();
    }
    if (app.search && typeof app.search.init === 'function') {
      app.search.init();
    }
    if (app.profile && typeof app.profile.init === 'function') {
      app.profile.init();
    }
    if (app.settings && typeof app.settings.init === 'function') {
      app.settings.init();
    }
  }

  app.init = init;
  app.setActiveTab = setActiveTab;
  app.applyTheme = applyTheme;
  app.openCommentSheet = openCommentSheet;
  app.closeCommentSheet = closeCommentSheet;
  app.openModal = openModal;
  app.closeModal = closeModal;
  app.api = app.api || window.TikTokApp.api;

  document.addEventListener('DOMContentLoaded', init);
})(window);
