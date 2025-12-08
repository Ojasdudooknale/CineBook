
export const MOCK_MOVIES = [
  { 
    id: 1, 
    title: "Cyberpunk: Edgerunners", 
    genre: "Sci-Fi / Action", 
    rating: 4.9, 
    duration: "2h 15m",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    desc: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw.",
    trailerId: "dQw4w9WgXcQ",
    director: "Hiroyuki Imaishi",
    producer: "Trigger Studio",
    cast: ["Kenichiro Ohashi", "Aoi Yuki", "Zach Aguilar", "Emi Lo"]
  },
  { 
    id: 2, 
    title: "The Last Horizon", 
    genre: "Drama / Adventure", 
    rating: 4.7, 
    duration: "2h 45m",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
    desc: "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailerId: "dQw4w9WgXcQ",
    director: "Christopher Nolan",
    producer: "Emma Thomas",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
  },
  { 
    id: 3, 
    title: "Neon Nights", 
    genre: "Thriller / Mystery", 
    rating: 4.5, 
    duration: "1h 55m",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    desc: "A detective uncovers a deep conspiracy in the city's underbelly that leads to the highest levels of government.",
    trailerId: "dQw4w9WgXcQ",
    director: "David Fincher",
    producer: "Ceán Chaffin",
    cast: ["Brad Pitt", "Morgan Freeman", "Gwyneth Paltrow", "Kevin Spacey"]
  },
  { 
    id: 4, 
    title: "Velocity", 
    genre: "Action", 
    rating: 4.2, 
    duration: "2h 05m",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800",
    desc: "High stakes street racing takes a dangerous turn when the mafia gets involved.",
    trailerId: "dQw4w9WgXcQ",
    director: "Justin Lin",
    producer: "Neal H. Moritz",
    cast: ["Vin Diesel", "Paul Walker", "Michelle Rodriguez", "Jordana Brewster"]
  }
];

export const MOCK_THEATERS = [
  { id: 1, name: "PVR Icon: Gold Class", location: "Phoenix Mall, Lower Parel", times: ["09:00 AM", "01:30 PM", "06:00 PM", "10:00 PM"] },
  { id: 2, name: "INOX: Laserplex", location: "Nariman Point, South Mumbai", times: ["10:15 AM", "02:45 PM", "07:15 PM"] },
  { id: 3, name: "Cinepolis: IMAX", location: "Fun Republic, Andheri West", times: ["11:00 AM", "03:30 PM", "08:00 PM", "11:30 PM"] },
  { id: 4, name: "Carnival Cinemas", location: "Hiranandani Estate, Thane", times: ["09:30 AM", "12:00 PM", "04:00 PM"] }
];

export const MOCK_STATS = {
  revenue: "12,450",
  ticketsSold: "1,058",
  activeScreens: "4"
};

export const MOCK_SHOWS = [
  { id: 101, movie: "Cyberpunk: Edgerunners", time: "14:00", screen: 1, occupancy: "45/60" },
  { id: 102, movie: "The Last Horizon", time: "16:30", screen: 2, occupancy: "20/50" },
  { id: 103, movie: "Neon Nights", time: "19:00", screen: 1, occupancy: "58/60" },
];

export const MOCK_REQUESTS = [
  { id: 1, name: "Cinema Royal", location: "Brooklyn, NY", status: "Pending", date: "2024-03-10" },
  { id: 2, name: "Grand Theater", location: "Los Angeles, CA", status: "Active", date: "2024-03-08" },
  { id: 3, name: "Starlight Plex", location: "Austin, TX", status: "Pending", date: "2024-03-12" },
  { id: 4, name: "Metro Cinema", location: "Chicago, IL", status: "Rejected", date: "2024-03-01" },
];

export const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Adventure'];
export const TICKET_PRICE = 12;
