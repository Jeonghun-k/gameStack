const mockData = {
  user: {
    id: "nova_striker",
    displayName: "Nova Striker",
    avatar: null,
    bio: "Hardcore RPG & FPS enthusiast. 10K+ hours logged. Always down for co-op.",
    level: 42,
    xp: 8400,
    xpNext: 10000,
    joinedYear: 2021,
    platforms: ["Steam", "PlayStation", "Xbox"],
    location: "Seoul, KR",
    stats: {
      totalGames: 87,
      totalHours: 2340,
      completed: 34,
      playing: 6,
      backlog: 38,
      dropped: 9,
    },
  },

  library: [
    { id: 1,  title: "Elden Ring",           cover: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg", genre: ["RPG", "Action"],       status: "completed", rating: 5, hours: 120, metacritic: 96, year: 2022, platform: "PlayStation" },
    { id: 2,  title: "Cyberpunk 2077",        cover: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg", genre: ["RPG", "Open World"],   status: "playing",   rating: 4, hours: 63,  metacritic: 86, year: 2020, platform: "Steam" },
    { id: 3,  title: "Hades",                 cover: "https://media.rawg.io/media/games/1f4/1f47a270b8f241f1b837dec9cd80b5f5.jpg", genre: ["Roguelike", "Action"], status: "completed", rating: 5, hours: 80,  metacritic: 93, year: 2020, platform: "Steam" },
    { id: 4,  title: "God of War Ragnarök",   cover: "https://media.rawg.io/media/games/699/69907c05a1f3a32a1349ce64ebf4f4de.jpg", genre: ["Action", "Adventure"], status: "completed", rating: 5, hours: 45,  metacritic: 94, year: 2022, platform: "PlayStation" },
    { id: 5,  title: "Hollow Knight",         cover: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg", genre: ["Metroidvania", "Indie"], status: "backlog", rating: 0, hours: 0,   metacritic: 87, year: 2017, platform: "Steam" },
    { id: 6,  title: "Red Dead Redemption 2", cover: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg", genre: ["Open World", "Action"], status: "dropped",  rating: 3, hours: 22,  metacritic: 97, year: 2018, platform: "Xbox" },
    { id: 7,  title: "Baldur's Gate 3",       cover: "https://media.rawg.io/media/games/699/69907c05a1f3a32a1349ce64ebf4f4de.jpg", genre: ["RPG", "Strategy"],     status: "playing",   rating: 5, hours: 180, metacritic: 96, year: 2023, platform: "Steam" },
    { id: 8,  title: "The Witcher 3",         cover: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg", genre: ["RPG", "Open World"],   status: "completed", rating: 5, hours: 200, metacritic: 92, year: 2015, platform: "Steam" },
    { id: 9,  title: "Dark Souls III",        cover: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg", genre: ["RPG", "Action"],       status: "completed", rating: 4, hours: 90,  metacritic: 89, year: 2016, platform: "Steam" },
    { id: 10, title: "Horizon Zero Dawn",     cover: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg", genre: ["Action", "RPG"],       status: "backlog",   rating: 0, hours: 0,   metacritic: 89, year: 2017, platform: "PlayStation" },
    { id: 11, title: "Sekiro",                cover: "https://media.rawg.io/media/games/67f/67f62d1f062a6164f57575e0604ee9f6.jpg", genre: ["Action", "Adventure"], status: "completed", rating: 5, hours: 70,  metacritic: 90, year: 2019, platform: "Steam" },
    { id: 12, title: "Stardew Valley",        cover: "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg", genre: ["Simulation", "RPG"],   status: "playing",   rating: 4, hours: 55,  metacritic: 89, year: 2016, platform: "Steam" },
    { id: 13, title: "Monster Hunter: World", cover: "https://media.rawg.io/media/games/479/479c2b8ba9370eff7bb7a5a0ab8c80b0.jpg", genre: ["Action", "RPG"],       status: "backlog",   rating: 0, hours: 0,   metacritic: 88, year: 2018, platform: "Steam" },
    { id: 14, title: "Disco Elysium",         cover: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg", genre: ["RPG", "Adventure"],    status: "completed", rating: 5, hours: 40,  metacritic: 91, year: 2019, platform: "Steam" },
    { id: 15, title: "Doom Eternal",          cover: "https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg", genre: ["FPS", "Action"],       status: "dropped",   rating: 3, hours: 8,   metacritic: 88, year: 2020, platform: "Xbox" },
  ],

  lfgPosts: [
    { id: 1, user: "zero_pixel",   avatar: null, game: "Elden Ring",       type: "Co-op",  desc: "Malenia 공략 같이 해요! 협동 플레이 환영",      online: true,  tags: ["PvE", "Boss"],   time: "2m ago" },
    { id: 2, user: "kinetic_sage", avatar: null, game: "Baldur's Gate 3",  type: "Party",  desc: "Act 3 파티 구합니다. 마이크 필수 아님",           online: true,  tags: ["RPG", "Chill"],  time: "15m ago" },
    { id: 3, user: "lumin_arc",    avatar: null, game: "Cyberpunk 2077",   type: "Casual", desc: "사이드 퀘스트 같이 즐길 분, 스포 없게 해요",       online: false, tags: ["Open World"],    time: "1h ago" },
    { id: 4, user: "storm_echo",   avatar: null, game: "Monster Hunter",   type: "Hunt",   desc: "티어 5 몬스터 헌트 파티, 베테랑 환영",             online: true,  tags: ["Co-op", "Hunt"], time: "3h ago" },
    { id: 5, user: "vex_null",     avatar: null, game: "Hollow Knight",    type: "Guide",  desc: "처음 시작하는데 팁 공유해주실 분 있나요?",         online: true,  tags: ["Indie", "Help"], time: "5h ago" },
  ],

  activity: [
    { type: "completed", game: "Sekiro",         time: "2 days ago",  icon: "🏆" },
    { type: "added",     game: "Hollow Knight",  time: "3 days ago",  icon: "➕" },
    { type: "review",    game: "Elden Ring",     time: "1 week ago",  icon: "⭐" },
    { type: "playing",   game: "Stardew Valley", time: "1 week ago",  icon: "🎮" },
  ],

  genreStats: [
    { genre: "RPG",        count: 28, hours: 680, color: "#7C3AED" },
    { genre: "Action",     count: 22, hours: 420, color: "#a855f7" },
    { genre: "Open World", count: 12, hours: 390, color: "#c084fc" },
    { genre: "Indie",      count: 10, hours: 180, color: "#d946ef" },
    { genre: "FPS",        count: 8,  hours: 150, color: "#e879f9" },
    { genre: "Strategy",   count: 5,  hours: 90,  color: "#f0abfc" },
    { genre: "Simulation", count: 2,  hours: 55,  color: "#f5d0fe" },
  ],

  monthlyHours: [
    { month: "Nov", hours: 85  },
    { month: "Dec", hours: 120 },
    { month: "Jan", hours: 95  },
    { month: "Feb", hours: 140 },
    { month: "Mar", hours: 110 },
    { month: "Apr", hours: 160 },
  ],
};

export default mockData;
