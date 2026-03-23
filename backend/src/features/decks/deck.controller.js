import { Deck }  from '../../models/Deck.js'
import { Card }  from '../../models/Card.js'
import { Class } from '../../models/Class.js'

// GET /api/decks/:id
export const getDeck = async (req, res) => {
  const deck = await Deck.findById(req.params.id)
    .populate('owner', 'username avatar')
    .populate('class', 'name color icon')

  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  const cards = await Card.find({ deck: deck._id }).sort({ createdAt: 1 })
  res.json({ ...deck.toJSON(), cards })
}

// POST /api/decks
export const createDeck = async (req, res) => {
  const { title, description, isPublic, classId, cards = [] } = req.body

  if (!title)   return res.status(400).json({ message: 'Title is required' })
  if (!classId) return res.status(400).json({ message: 'Class ID is required' })

  const cls = await Class.findById(classId)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  // Only class owner can add decks
  if (cls.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const deck = await Deck.create({
    title, description, isPublic,
    class: classId,
    owner: req.user._id,
  })

  // Create cards if provided
  let createdCards = []
  if (cards.length > 0) {
    createdCards = await Card.insertMany(
      cards.map((c) => ({
        front:      c.front,
        back:       c.back,
        frontImage: c.frontImage ?? null,
        backImage:  c.backImage  ?? null,
        deck:       deck._id,
      }))
    )
  }

  await deck.populate('owner', 'username avatar')
  res.status(201).json({ ...deck.toJSON(), cards: createdCards })
}

// PUT /api/decks/:id
export const updateDeck = async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (deck.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { title, description, isPublic } = req.body
  Object.assign(deck, { title, description, isPublic })
  await deck.save()

  const cards = await Card.find({ deck: deck._id }).sort({ createdAt: 1 })
  res.json({ ...deck.toJSON(), cards })
}

// DELETE /api/decks/:id
export const deleteDeck = async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (deck.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  await Card.deleteMany({ deck: deck._id })
  await deck.deleteOne()

  res.json({ message: 'Deck deleted successfully' })
}

// POST /api/decks/:id/cards — bulk add cards
export const addCards = async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (deck.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { cards = [] } = req.body
  if (cards.length === 0) {
    return res.status(400).json({ message: 'No cards provided' })
  }

  const created = await Card.insertMany(
    cards.map((c) => ({
      front:      c.front,
      back:       c.back,
      frontImage: c.frontImage ?? null,
      backImage:  c.backImage  ?? null,
      deck:       deck._id,
    }))
  )

  res.status(201).json(created)
}