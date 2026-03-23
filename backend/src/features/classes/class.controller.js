import { Class } from '../../models/Class.js'
import { Deck }  from '../../models/Deck.js'
import { Card }  from '../../models/Card.js'

// GET /api/classes
export const getClasses = async (req, res) => {
  const { q, onlyMine } = req.query

  const filter = onlyMine === 'true'
    ? { owner: req.user._id }
    : { $or: [{ isPublic: true }, { owner: req.user._id }] }

  if (q) {
    filter.name = { $regex: q, $options: 'i' }
  }

  const classes = await Class.find(filter)
    .populate('owner', 'username avatar')
    .sort({ createdAt: -1 })

  // Attach deck count to each class
  const withCounts = await Promise.all(
    classes.map(async (cls) => {
      const deckCount = await Deck.countDocuments({ class: cls._id })
      return { ...cls.toJSON(), deckCount }
    })
  )

  res.json(withCounts)
}

// GET /api/classes/:id
export const getClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
    .populate('owner', 'username avatar')

  if (!cls) return res.status(404).json({ message: 'Class not found' })

  const deckCount = await Deck.countDocuments({ class: cls._id })
  res.json({ ...cls.toJSON(), deckCount })
}

// POST /api/classes
export const createClass = async (req, res) => {
  const { name, description, icon, color, isPublic } = req.body

  if (!name) return res.status(400).json({ message: 'Name is required' })

  const cls = await Class.create({
    name, description, icon, color, isPublic,
    owner: req.user._id,
  })

  await cls.populate('owner', 'username avatar')
  res.status(201).json({ ...cls.toJSON(), deckCount: 0 })
}

// PUT /api/classes/:id
export const updateClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (cls.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { name, description, icon, color, isPublic } = req.body
  Object.assign(cls, { name, description, icon, color, isPublic })
  await cls.save()

  await cls.populate('owner', 'username avatar')
  const deckCount = await Deck.countDocuments({ class: cls._id })
  res.json({ ...cls.toJSON(), deckCount })
}

// DELETE /api/classes/:id
export const deleteClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (cls.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  // Cascade delete decks and cards
  const decks = await Deck.find({ class: cls._id })
  await Promise.all(decks.map((d) => Card.deleteMany({ deck: d._id })))
  await Deck.deleteMany({ class: cls._id })
  await cls.deleteOne()

  res.json({ message: 'Class deleted successfully' })
}

// GET /api/classes/:id/decks
export const getDecksByClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  const decks = await Deck.find({ class: req.params.id })
    .populate('owner', 'username avatar')
    .sort({ createdAt: -1 })

  // Attach cards to each deck
  const withCards = await Promise.all(
    decks.map(async (deck) => {
      const cards = await Card.find({ deck: deck._id }).sort({ createdAt: 1 })
      return { ...deck.toJSON(), cards }
    })
  )

  res.json(withCards)
}