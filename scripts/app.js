(function () {
  const state = {
    theme: 'dark',
    activeTab: 'feedTab',
    currentUserId: 'u_1',
    notifications: {
      likes: true,
      comments: true,
      follows: false,
      messages: true
    },
    users: [
      {
        id: 'u_1',
        name: 'Maria Silva',
        username: '@maria',
        bio: 'Viajando, criando e aproveitando o melhor do dia.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        following: 468,
        followers: 18940,
        likes: 56280
      },
      {
        id: 'u_2',
        name: 'João Pereira',
        username: '@joao',
        bio: 'Gastronomia, música e bons momentos em movimento.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        following: 240,
        followers: 9830,
        likes: 34650
      },
      {
        id: 'u_3',
        name: 'Ana Costa',
        username: '@ana',
        bio: 'Treino, disciplina e energia para todos os dias.',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
        following: 890,
        followers: 27500,
        likes: 80400
      }
    ],
    videos: [
      {
        id: 'v_1',
        userId: 'u_1',
        title: 'Sunset vibes',
        description: 'A melhor parte do dia para respirar fundo e aproveitar a luz.',
        tags: ['#sunset', '#travel', '#vibes'],
        likes: 18640,
        likedBy: ['u_1', 'u_2', 'u_3'],
        comments: [
          { id: 'c_1', user: '@joao', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', text: 'Que paz 😍' },
          { id: 'c_2', user: '@ana', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80', text: 'Lugar lindo!' }
        ],
        src: 'https://player.vimeo.com/external/449188176.sd.mp4?s=ef0a5dd8b4da90bb6d172abc8e51f2d1f86bc8bf&profile_id=164&oauth2_token_id=57447761'
      },
      {
        id: 'v_2',
        userId: 'u_2',
        title: 'Street food night',
        description: 'Comida boa, música alta e a cidade viva até tarde.',
        tags: ['#food', '#night', '#city'],
        likes: 13210,
        likedBy: ['u_1'],
        comments: [
          { id: 'c_3', user: '@maria', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', text: 'Essa comida está incrível!' }
        ],
        src: 'https://player.vimeo.com/external/484407098.sd.mp4?s=0d59e2c8e44b4d3e2d7b831d8504f647a3ef7777&profile_id=164&oauth2_token_id=57447761'
      },
      {
        id: 'v_3',
        userId: 'u_3',
        title: 'Gym mood',
        description: 'Foco, disciplina e muita energia para seguir firme.',
        tags: ['#fitness', '#motivation', '#daily'],
        likes: 22460,
        likedBy: ['u_1', 'u_2'],
        comments: [
          { id: 'c_4', user: '@maria', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', text: 'Você inspira demais!' },
          { id: 'c_5', user: '@joao', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', text: 'Muito bom! 🔥' }
        ],
        src: 'https://player.vimeo.com/external/512166703.sd.mp4?s=22d6db6b0887e1dfa3f60e53db4f9ce050b0c4a8&profile_id=164&oauth2_token_id=57447761'
      },
      {
        id: 'v_4',
        userId: 'u_1',
        title: 'Pé na areia',
        description: 'Momentos simples que a cidade lembra a gente.',
        tags: ['#beach', '#weekend', '#relax'],
        likes: 9860,
        likedBy: ['u_3'],
        comments: [
          { id: 'c_6', user: '@ana', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80', text: 'Quero estar aí também!' }
        ],
        src: 'https://player.vimeo.com/external/538186796.sd.mp4?s=b65f4cc6caa0f0cc99460c3ef5e0ee0ca3d5dd55&profile_id=164&oauth2_token_id=57447761'
      },
      {
        id: 'v_5',
        userId: 'u_2',
        title: 'Coffee run',
        description: 'Café, música e uma caminhada matinal sem pressa.',
        tags: ['#coffee', '#morning', '#routine'],
        likes: 11200,
        likedBy: ['u_1', 'u_3'],
        comments: [
          { id: 'c_7', user: '@ana', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80', text: 'A rotina perfeita 👌' }
        ],
        src: 'https://player.vimeo.com/external/489436523.sd.mp4?s=0402128b1d164362e9b0a93cc4e8d5a0f38b7777&profile_id=164&oauth2_token_id=57447761'
      },
      {
        id: 'v_6',
        userId: 'u_3',
        title: 'Sprint day',
        description: 'A melhor energia do dia vem quando a gente escolhe se mover.',
        tags: ['#run', '#active', '#challenge'],
        likes: 17890,
        likedBy: ['u_2'],
        comments: [
          { id: 'c_8', user: '@joao', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', text: 'Que treino incrível!' }
        ],
        src: 'https://player.vimeo.com/external/457288238.sd.mp4?s=8262fa1bb5f16233b1a0dca09c5d03d4cad84d5d&profile_id=164&oauth2_token_id=57447761'
      }
    ]
  };

  window.appState = state;

  const api = {
    getUser(userId) {
      return state.users.find((user) => user.id === userId) || null;
    },
    getCurrentUser() {
      return this.getUser(state.currentUserId);
    },
    getVideo(videoId) {
      return state.videos.find((video) => video.id === videoId) || null;
    },
    formatNumber(value) {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return String(value);
    }
  };

  window.TikTokApp = window.TikTokApp || {};
  window.TikTokApp.api = api;
})();
