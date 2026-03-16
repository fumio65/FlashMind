// Mock Classes API — Phase A (frontend only)

export const CLASS_ICONS = {
  emoji: ['📚', '📐', '🧬', '💻', '🏛️', '🇵🇭', '🔬', '🧮', '📝', '🎯',
          '🧪', '📊', '🌍', '⚡', '🔭', '🎨', '🏥', '⚖️', '🌱', '🎵'],
  lucide: [
    'BookOpen', 'Calculator', 'FlaskConical', 'Code', 'Globe', 'Landmark',
    'Microscope', 'BarChart', 'Leaf', 'Music', 'Heart', 'Scale',
    'Cpu', 'Zap', 'Atom', 'PenTool', 'Database', 'Network',
  ],
}

export const CLASS_COLORS = [
  { label: 'Ocean',    value: 'from-blue-500 to-cyan-400'       },
  { label: 'Violet',   value: 'from-violet-500 to-purple-400'   },
  { label: 'Emerald',  value: 'from-emerald-500 to-teal-400'    },
  { label: 'Sunset',   value: 'from-orange-500 to-amber-400'    },
  { label: 'Rose',     value: 'from-rose-500 to-pink-400'       },
  { label: 'Indigo',   value: 'from-indigo-500 to-blue-400'     },
]

export const MOCK_CLASSES = [
  {
    _id:         'cls1',
    name:        'BSIT 2nd Year — 2nd Sem',
    description: 'Core subjects for 2nd year BSIT students.',
    icon:        { type: 'emoji', value: '💻' },
    color:       'from-blue-500 to-cyan-400',
    owner:       { _id: '1', username: 'juandc' },
    isPublic:    true,
    createdAt:   new Date('2024-01-15'),
    deckCount:   3,
  },
  {
    _id:         'cls2',
    name:        'Mathematics',
    description: 'Calculus, algebra, and discrete math.',
    icon:        { type: 'emoji', value: '📐' },
    color:       'from-violet-500 to-purple-400',
    owner:       { _id: '1', username: 'juandc' },
    isPublic:    true,
    createdAt:   new Date('2024-02-01'),
    deckCount:   2,
  },
  {
    _id:         'cls3',
    name:        'Natural Sciences',
    description: 'Biology, chemistry, and physics.',
    icon:        { type: 'emoji', value: '🧬' },
    color:       'from-emerald-500 to-teal-400',
    owner:       { _id: '3', username: 'mariasantos' },
    isPublic:    true,
    createdAt:   new Date('2024-02-10'),
    deckCount:   2,
  },
  {
    _id:         'cls4',
    name:        'Filipino at Panitikan',
    description: 'Mga akda at may-akda ng panitikang Pilipino.',
    icon:        { type: 'emoji', value: '🇵🇭' },
    color:       'from-rose-500 to-pink-400',
    owner:       { _id: '3', username: 'mariasantos' },
    isPublic:    true,
    createdAt:   new Date('2024-03-01'),
    deckCount:   1,
  },
  {
    _id:         'cls5',
    name:        'Philippine History',
    description: 'Key events, figures, and documents in Philippine history.',
    icon:        { type: 'emoji', value: '🏛️' },
    color:       'from-orange-500 to-amber-400',
    owner:       { _id: '1', username: 'juandc' },
    isPublic:    false,
    createdAt:   new Date('2024-03-15'),
    deckCount:   1,
  },
]

export const MOCK_DECKS_BY_CLASS = {
  cls1: [
    { _id: 'd1', title: 'Data Structures & Algorithms', description: 'Arrays, trees, graphs, and sorting algorithms.', classId: 'cls1', cards: [{_id:'c1',front:'What is a stack?',back:'LIFO data structure.'},{_id:'c2',front:'What is a queue?',back:'FIFO data structure.'},{_id:'c3',front:'What is Big-O?',back:'Upper bound complexity notation.'},{_id:'c4',front:'What is binary search?',back:'O(log n) search on sorted arrays.'},{_id:'c5',front:'What is a linked list?',back:'Nodes connected by pointers.'}], createdAt: new Date('2024-01-20') },
    { _id: 'd2', title: 'Database Management', description: 'SQL, normalization, and transactions.', classId: 'cls1', cards: [{_id:'c6',front:'What is normalization?',back:'Process of organizing data to reduce redundancy.'},{_id:'c7',front:'What is a primary key?',back:'A unique identifier for each record in a table.'},{_id:'c8',front:'What is SQL?',back:'Structured Query Language for managing relational databases.'},{_id:'c9',front:'What is ACID?',back:'Atomicity, Consistency, Isolation, Durability.'}], createdAt: new Date('2024-01-25') },
    { _id: 'd3', title: 'Object-Oriented Programming', description: 'OOP principles and design patterns.', classId: 'cls1', cards: [{_id:'c10',front:'What is encapsulation?',back:'Bundling data and methods that operate on that data.'},{_id:'c11',front:'What is inheritance?',back:'A class deriving properties from another class.'},{_id:'c12',front:'What is polymorphism?',back:'The ability to take many forms.'}], createdAt: new Date('2024-02-01') },
  ],
  cls2: [
    { _id: 'd4', title: 'Calculus — Limits & Derivatives', description: 'Core differential calculus concepts.', classId: 'cls2', cards: [{_id:'c13',front:'What is a limit?',back:'Value a function approaches as input approaches a value.'},{_id:'c14',front:'What is a derivative?',back:'Instantaneous rate of change.'},{_id:'c15',front:'Power Rule',back:'If f(x)=x^n then f\'(x)=nx^(n-1).'}], createdAt: new Date('2024-02-05') },
    { _id: 'd5', title: 'Discrete Mathematics', description: 'Logic, sets, and graph theory.', classId: 'cls2', cards: [{_id:'c16',front:'What is a proposition?',back:'A statement that is either true or false.'},{_id:'c17',front:'What is a set?',back:'A collection of distinct objects.'}], createdAt: new Date('2024-02-10') },
  ],
  cls3: [
    { _id: 'd6', title: 'General Biology — Cell Structure', description: 'Cell organelles and processes.', classId: 'cls3', cards: [{_id:'c18',front:'Powerhouse of the cell?',back:'Mitochondria — produces ATP.'},{_id:'c19',front:'What does the nucleus do?',back:'Controls cell activities and contains DNA.'},{_id:'c20',front:'What is the cell membrane?',back:'Phospholipid bilayer controlling entry/exit.'}], createdAt: new Date('2024-02-15') },
    { _id: 'd7', title: 'Thermodynamics Basics', description: 'Laws of thermodynamics and heat transfer.', classId: 'cls3', cards: [{_id:'c21',front:'First Law of Thermodynamics',back:'Energy cannot be created or destroyed.'},{_id:'c22',front:'Second Law of Thermodynamics',back:'Entropy of an isolated system always increases.'}], createdAt: new Date('2024-03-01') },
  ],
  cls4: [
    { _id: 'd8', title: 'Filipino — Panitikan', description: 'Mga piling akda at may-akda.', classId: 'cls4', cards: [{_id:'c23',front:'Sino ang sumulat ng "Florante at Laura"?',back:'Francisco Baltazar (Balagtas).'},{_id:'c24',front:'Ano ang awit?',back:'Tulang may 12 pantig sa bawat linya.'}], createdAt: new Date('2024-03-05') },
  ],
  cls5: [
    { _id: 'd9', title: 'Philippine History — Rizal', description: "Key events in Rizal's life.", classId: 'cls5', cards: [{_id:'c25',front:'When was Rizal born?',back:'June 19, 1861, Calamba, Laguna.'},{_id:'c26',front:'When was Rizal executed?',back:'December 30, 1896, Bagumbayan.'}], createdAt: new Date('2024-03-20') },
  ],
}

// ── API functions ──

export const getClasses = (filters = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      let results = [...MOCK_CLASSES]
      if (filters.q) {
        const q = filters.q.toLowerCase()
        results = results.filter((c) =>
          c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        )
      }
      if (filters.onlyMine) results = results.filter((c) => c.owner._id === '1')
      resolve(results)
    }, 300)
  })

export const getClass = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const cls = MOCK_CLASSES.find((c) => c._id === id)
      cls ? resolve(cls) : reject(new Error('Class not found'))
    }, 300)
  })

export const getDecksByClass = (classId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DECKS_BY_CLASS[classId] ?? [])
    }, 300)
  })

export const getDeck = (deckId) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = Object.values(MOCK_DECKS_BY_CLASS).flat()
      const deck = all.find((d) => d._id === deckId)
      deck ? resolve(deck) : reject(new Error('Deck not found'))
    }, 300)
  })

export const createClass = (data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data, _id: `cls${Date.now()}`, createdAt: new Date(), deckCount: 0 })
    }, 600)
  })

export const createDeck = (data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data, _id: `d${Date.now()}`, createdAt: new Date(), cards: [] })
    }, 600)
  })

export const copyClass = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const cls = MOCK_CLASSES.find((c) => c._id === id)
      resolve({ ...cls, _id: `cls${Date.now()}`, name: `${cls.name} (Copy)` })
    }, 400)
  })

export const getMyStats = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const allDecks    = Object.values(MOCK_DECKS_BY_CLASS).flat()
      const myClasses   = MOCK_CLASSES.filter((c) => c.owner._id === '1')
      resolve({
        studyStreak:    5,
        cardsMastered:  18,
        totalSessions:  5,
        weeklyActivity: [
          { day: 'Mon', cards: 12 },
          { day: 'Tue', cards: 8  },
          { day: 'Wed', cards: 20 },
          { day: 'Thu', cards: 5  },
          { day: 'Fri', cards: 15 },
          { day: 'Sat', cards: 30 },
          { day: 'Sun', cards: 0  },
        ],
        recentClasses: myClasses.slice(0, 3),
        totalDecks:    allDecks.length,
      })
    }, 400)
  })