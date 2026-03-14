// Mock deck API — Phase A (frontend only)

export const MOCK_DECKS = [
  {
    _id: '1',
    title: 'Calculus — Limits & Derivatives',
    description: 'Core concepts of differential calculus for STEM students.',
    category: 'Math',
    tags: ['calculus', 'derivatives', 'limits'],
    isPublic: true,
    owner: { _id: '3', username: 'mariasantos', avatar: null },
    coverImage: null,
    createdAt: new Date('2024-02-01'),
    cards: [
      { _id: 'c1', front: 'What is a limit?', back: 'A limit describes the value a function approaches as the input approaches a certain value.', frontImage: null, backImage: null },
      { _id: 'c2', front: 'Define a derivative.', back: 'The derivative is the instantaneous rate of change of a function with respect to a variable.', frontImage: null, backImage: null },
      { _id: 'c3', front: 'What is the Power Rule?', back: "If f(x) = x^n, then f'(x) = nx^(n-1).", frontImage: null, backImage: null },
      { _id: 'c4', front: 'What is a continuity?', back: 'A function is continuous at a point if the limit exists, the function is defined, and both are equal.', frontImage: null, backImage: null },
      { _id: 'c5', front: "What is L'Hôpital's Rule?", back: 'If a limit yields 0/0 or ∞/∞, differentiate numerator and denominator separately and re-evaluate.', frontImage: null, backImage: null },
    ],
  },
  {
    _id: '2',
    title: 'Philippine History — Rizal',
    description: "Key events and works of Dr. José Rizal's life.",
    category: 'History',
    tags: ['rizal', 'philippine history', 'noli me tangere'],
    isPublic: true,
    owner: { _id: '1', username: 'juandc', avatar: null },
    coverImage: null,
    createdAt: new Date('2024-02-10'),
    cards: [
      { _id: 'c6', front: 'When was José Rizal born?', back: 'June 19, 1861, in Calamba, Laguna.', frontImage: null, backImage: null },
      { _id: 'c7', front: 'What is Noli Me Tángere about?', back: 'A social novel exposing the abuses of the Spanish colonial government and the Catholic Church in the Philippines.', frontImage: null, backImage: null },
      { _id: 'c8', front: 'Where was Rizal exiled?', back: 'Dapitan, Zamboanga del Norte, from 1892 to 1896.', frontImage: null, backImage: null },
      { _id: 'c9', front: 'What is El Filibusterismo?', back: "The sequel to Noli Me Tángere, depicting the darker consequences of colonial oppression and the ilustrado's struggle.", frontImage: null, backImage: null },
      { _id: 'c10', front: 'When was Rizal executed?', back: 'December 30, 1896, at Bagumbayan (now Luneta Park), Manila.', frontImage: null, backImage: null },
    ],
  },
  {
    _id: '3',
    title: 'Data Structures & Algorithms',
    description: 'Fundamental DSA concepts for IT and CS students.',
    category: 'IT',
    tags: ['dsa', 'algorithms', 'arrays', 'trees'],
    isPublic: true,
    owner: { _id: '3', username: 'mariasantos', avatar: null },
    coverImage: null,
    createdAt: new Date('2024-03-01'),
    cards: [
      { _id: 'c11', front: 'What is Big-O notation?', back: 'A mathematical notation that describes the upper bound of an algorithm\'s time or space complexity.', frontImage: null, backImage: null },
      { _id: 'c12', front: 'What is a stack?', back: 'A linear data structure that follows LIFO (Last In, First Out) order.', frontImage: null, backImage: null },
      { _id: 'c13', front: 'What is a queue?', back: 'A linear data structure that follows FIFO (First In, First Out) order.', frontImage: null, backImage: null },
      { _id: 'c14', front: 'What is binary search?', back: 'An algorithm that finds a target value in a sorted array by repeatedly halving the search space. O(log n).', frontImage: null, backImage: null },
      { _id: 'c15', front: 'What is a binary tree?', back: 'A tree data structure where each node has at most two children: left and right.', frontImage: null, backImage: null },
    ],
  },
  {
    _id: '4',
    title: 'General Biology — Cell Structure',
    description: 'Cell organelles, functions, and processes for Biology 101.',
    category: 'Science',
    tags: ['biology', 'cells', 'organelles'],
    isPublic: true,
    owner: { _id: '1', username: 'juandc', avatar: null },
    coverImage: null,
    createdAt: new Date('2024-03-15'),
    cards: [
      { _id: 'c16', front: 'What is the powerhouse of the cell?', back: 'The mitochondria — produces ATP through cellular respiration.', frontImage: null, backImage: null },
      { _id: 'c17', front: 'What does the nucleus do?', back: 'Controls cell activities and contains the cell\'s genetic material (DNA).', frontImage: null, backImage: null },
      { _id: 'c18', front: 'What is the cell membrane?', back: 'A phospholipid bilayer that controls what enters and exits the cell.', frontImage: null, backImage: null },
    ],
  },
  {
    _id: '5',
    title: 'Filipino — Panitikan',
    description: 'Mga piling akda at may-akda ng panitikang Pilipino.',
    category: 'Filipino',
    tags: ['panitikan', 'filipino', 'literatura'],
    isPublic: true,
    owner: { _id: '3', username: 'mariasantos', avatar: null },
    coverImage: null,
    createdAt: new Date('2024-03-20'),
    cards: [
      { _id: 'c19', front: 'Sino ang sumulat ng "Florante at Laura"?', back: 'Francisco Baltazar (Balagtas), isinulat noong 1838.', frontImage: null, backImage: null },
      { _id: 'c20', front: 'Ano ang awit?', back: 'Isang uri ng tulang may 12 pantig sa bawat linya at karaniwang may temang pag-ibig o pakikipagsapalaran.', frontImage: null, backImage: null },
    ],
  },
  {
    _id: '6',
    title: 'Thermodynamics Basics',
    description: 'Laws of thermodynamics and heat transfer for engineering students.',
    category: 'Science',
    tags: ['thermodynamics', 'physics', 'engineering'],
    isPublic: false,
    owner: { _id: '1', username: 'juandc', avatar: null },
    coverImage: null,
    createdAt: new Date('2024-04-01'),
    cards: [
      { _id: 'c21', front: 'State the First Law of Thermodynamics.', back: 'Energy cannot be created or destroyed, only converted from one form to another.', frontImage: null, backImage: null },
      { _id: 'c22', front: 'State the Second Law of Thermodynamics.', back: 'Heat flows naturally from hot to cold; entropy of an isolated system always increases.', frontImage: null, backImage: null },
    ],
  },
]

export const MOCK_SESSIONS = [
  { _id: 's1', deck: { _id: '1', title: 'Calculus — Limits & Derivatives' }, mode: 'flashcard', score: null, knownCount: 4, timeTaken: 180, completedAt: new Date('2024-04-10T09:00:00') },
  { _id: 's2', deck: { _id: '3', title: 'Data Structures & Algorithms' },    mode: 'quiz',      score: 80,   knownCount: null, timeTaken: 240, completedAt: new Date('2024-04-11T14:30:00') },
  { _id: 's3', deck: { _id: '2', title: 'Philippine History — Rizal' },      mode: 'flashcard', score: null, knownCount: 5, timeTaken: 210, completedAt: new Date('2024-04-12T10:00:00') },
  { _id: 's4', deck: { _id: '1', title: 'Calculus — Limits & Derivatives' }, mode: 'quiz',      score: 60,   knownCount: null, timeTaken: 300, completedAt: new Date('2024-04-13T16:00:00') },
  { _id: 's5', deck: { _id: '4', title: 'General Biology — Cell Structure' }, mode: 'quiz',     score: 100,  knownCount: null, timeTaken: 150, completedAt: new Date('2024-04-14T08:00:00') },
]

export const MOCK_WEEKLY_ACTIVITY = [
  { day: 'Mon', cards: 12 },
  { day: 'Tue', cards: 8  },
  { day: 'Wed', cards: 20 },
  { day: 'Thu', cards: 5  },
  { day: 'Fri', cards: 15 },
  { day: 'Sat', cards: 30 },
  { day: 'Sun', cards: 0  },
]

// API functions — same signatures as real API (Phase B just replaces the body)
export const getDecks     = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = MOCK_DECKS.filter((d) => d.isPublic)
      if (filters.q) {
        const q = filters.q.toLowerCase()
        results = results.filter(
          (d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
        )
      }
      if (filters.category && filters.category !== 'All') {
        results = results.filter((d) => d.category === filters.category)
      }
      if (filters.sort === 'oldest') results = [...results].sort((a, b) => a.createdAt - b.createdAt)
      if (filters.sort === 'az')     results = [...results].sort((a, b) => a.title.localeCompare(b.title))
      resolve(results)
    }, 300)
  })
}

export const getDeck = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const deck = MOCK_DECKS.find((d) => d._id === id)
      deck ? resolve(deck) : reject(new Error('Deck not found'))
    }, 300)
  })

export const createDeck = (data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data, _id: String(Date.now()), createdAt: new Date() })
    }, 600)
  })

export const copyDeck = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const deck = MOCK_DECKS.find((d) => d._id === id)
      resolve({ ...deck, _id: String(Date.now()), title: `${deck.title} (Copy)` })
    }, 400)
  })

export const getMyStats = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        studyStreak: 5,
        cardsMastered: 18,
        totalSessions: MOCK_SESSIONS.length,
        weeklyActivity: MOCK_WEEKLY_ACTIVITY,
        recentDecks: MOCK_DECKS.slice(0, 3),
        sessions: MOCK_SESSIONS,
      })
    }, 400)
  })