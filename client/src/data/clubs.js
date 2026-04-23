// GEU Campus Clubs — centralized data used across Events, Home, Clubs page
export const GEU_CLUBS = [
  {
    id: 'byteforge',
    name: 'ByteForge Club',
    shortName: 'ByteForge',
    tagline: 'Code · Build · Innovate',
    description:
      'GEU\'s premier technical club for coders, hackers, and problem-solvers. Hosts hackathons, coding contests, AI workshops, and open-source sprints.',
    logo: '💻',
    logoColor: '#1e40af',
    logoBg: '#dbeafe',
    accentColor: '#1e40af',
    category: 'Technical',
    mentor: {
      name: 'Prof. Rajesh Sharma',
      designation: 'Associate Professor, CSE',
      email: 'sharma@geu.ac.in',
    },
    founded: '2018',
    members: 320,
    eventsOrganized: 48,
    tags: ['coding', 'hackathon', 'AI', 'open-source'],
  },
  {
    id: 'robocraft',
    name: 'RoboCraft Club',
    shortName: 'RoboCraft',
    tagline: 'Engineer · Automate · Conquer',
    description:
      'Robotics and electronics enthusiasts building bots, IoT devices, and competing in national robo-wars. Home of GEU\'s award-winning robotics team.',
    logo: '🤖',
    logoColor: '#b45309',
    logoBg: '#fef3c7',
    accentColor: '#b45309',
    category: 'Technical',
    mentor: {
      name: 'Prof. Anita Verma',
      designation: 'Assistant Professor, ECE',
      email: 'verma@geu.ac.in',
    },
    founded: '2019',
    members: 180,
    eventsOrganized: 29,
    tags: ['robotics', 'IoT', 'electronics', 'automation'],
  },
  {
    id: 'artwave',
    name: 'ArtWave Club',
    shortName: 'ArtWave',
    tagline: 'Create · Perform · Inspire',
    description:
      'GEU\'s cultural powerhouse — dance, drama, music, photography, and fine arts. Leads the cultural wing of GRAFEST and hosts inter-college competitions.',
    logo: '🎨',
    logoColor: '#7c3aed',
    logoBg: '#ede9fe',
    accentColor: '#7c3aed',
    category: 'Cultural',
    mentor: {
      name: 'Prof. Kavita Mehta',
      designation: 'Asst. Professor, Humanities',
      email: 'mehta@geu.ac.in',
    },
    founded: '2016',
    members: 410,
    eventsOrganized: 62,
    tags: ['dance', 'music', 'drama', 'photography', 'art'],
  },
  {
    id: 'greenearth',
    name: 'GreenEarth Club',
    shortName: 'GreenEarth',
    tagline: 'Sustain · Educate · Act',
    description:
      'Driving sustainability and eco-awareness across GEU campus. Organises plantation drives, eco-hackathons, energy audits, and UN SDG workshops.',
    logo: '🌱',
    logoColor: '#15803d',
    logoBg: '#dcfce7',
    accentColor: '#15803d',
    category: 'Other',
    mentor: {
      name: 'Prof. Manish Joshi',
      designation: 'Associate Professor, Civil Engg.',
      email: 'joshi@geu.ac.in',
    },
    founded: '2020',
    members: 235,
    eventsOrganized: 31,
    tags: ['sustainability', 'environment', 'SDG', 'green'],
  },
];

// Helper — get club by id
export const getClubById = id => GEU_CLUBS.find(c => c.id === id) || null;

// Map from club name → club object (for event lookup)
export const CLUB_BY_NAME = Object.fromEntries(GEU_CLUBS.map(c => [c.name, c]));
