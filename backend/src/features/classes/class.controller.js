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
// PUT /api/classes/:id
export const updateClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (cls.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { name, description, icon, color, isPublic } = req.body

  // Use explicit checks — don't use ?? as it skips empty strings and false
  if (name        !== undefined) cls.name        = name
  if (description !== undefined) cls.description = description
  if (color       !== undefined) cls.color       = color
  if (isPublic    !== undefined) cls.isPublic    = isPublic

  // Always mark icon as modified since it's a nested object
  if (icon !== undefined) {
    cls.icon = { type: icon.type, value: icon.value }
    cls.markModified('icon')
  }

  // Mark all fields as modified to force Mongoose to save them
  cls.markModified('name')
  cls.markModified('description')
  cls.markModified('color')
  cls.markModified('isPublic')

  await cls.save()

  const fresh = await Class.findById(cls._id).populate('owner', 'username avatar')
  const deckCount = await Deck.countDocuments({ class: fresh._id })

  res.json({ ...fresh.toJSON(), deckCount })
}

// DELETE /api/classes/:id
export const deleteClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (cls.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

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

  // Show public decks OR decks owned by the current user
  const filter = {
    class: req.params.id,
    $or: [
      { isPublic: true },
      { owner: req.user._id },
    ],
  }

  const decks = await Deck.find(filter)
    .populate('owner', 'username avatar')
    .sort({ createdAt: -1 })

  const withCards = await Promise.all(
    decks.map(async (deck) => {
      const cards = await Card.find({ deck: deck._id }).sort({ createdAt: 1 })
      return { ...deck.toJSON(), cards }
    })
  )

  res.json(withCards)
}

// POST /api/classes/:id/copy
export const copyClass = async (req, res) => {
  const original = await Class.findById(req.params.id)
  if (!original) return res.status(404).json({ message: 'Class not found' })

  const copy = await Class.create({
    name:        `${original.name} (Copy)`,
    description: original.description,
    icon:        original.icon,
    color:       original.color,
    isPublic:    false,
    owner:       req.user._id,
  })

  const decks = await Deck.find({ class: original._id })
  await Promise.all(decks.map(async (deck) => {
    const newDeck = await Deck.create({
      title:       deck.title,
      description: deck.description,
      isPublic:    false,
      class:       copy._id,
      owner:       req.user._id,
    })
    const cards = await Card.find({ deck: deck._id })
    if (cards.length > 0) {
      await Card.insertMany(cards.map((c) => ({
        front:      c.front,
        back:       c.back,
        frontImage: c.frontImage,
        backImage:  c.backImage,
        deck:       newDeck._id,
      })))
    }
  }))

  await copy.populate('owner', 'username avatar')
  const deckCount = await Deck.countDocuments({ class: copy._id })
  res.status(201).json({ ...copy.toJSON(), deckCount })
}