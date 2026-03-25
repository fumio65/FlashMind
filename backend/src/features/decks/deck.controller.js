import { Class, Deck, Card, User } from '../../models/index.js'

const formatDeck = (deck) => {
  const json = deck.toJSON ? deck.toJSON() : deck
  return {
    ...json,
    _id:   json.id,
    owner: json.owner ? { ...json.owner, _id: json.owner.id } : null,
    class: json.class ? { ...json.class, _id: json.class.id } : null,
    cards: (json.cards ?? []).map((c) => ({ ...c, _id: c.id })),
  }
}

// GET /api/decks/:id
export const getDeck = async (req, res) => {
  const deck = await Deck.findByPk(req.params.id, {
    include: [
      { model: User,  as: 'owner', attributes: ['id', 'username', 'avatar'] },
      { model: Class, as: 'class', attributes: ['id', 'name', 'color', 'iconType', 'iconValue'] },
      { model: Card,  as: 'cards', order: [['createdAt', 'ASC']] },
    ],
  })
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  const isOwner = Number(deck.ownerId) === Number(req.user.id)
  const isAdmin = req.user.role === 'admin'

  // Only block access if private AND not owner AND not admin
  if (!deck.isPublic && !isOwner && !isAdmin) {
    return res.status(403).json({ message: 'This deck is private' })
  }

  res.json(formatDeck(deck))
}

// POST /api/decks
export const createDeck = async (req, res) => {
  const { title, description, isPublic, classId, cards = [] } = req.body

  if (!title)   return res.status(400).json({ message: 'Title is required' })
  if (!classId) return res.status(400).json({ message: 'Class ID is required' })

  const cls = await Class.findByPk(classId)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (Number(cls.ownerId) !== Number(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const deck = await Deck.create({
    title, description, isPublic,
    classId,
    ownerId: Number(req.user.id),
  })

  let createdCards = []
  if (cards.length > 0) {
    createdCards = await Card.bulkCreate(
      cards.map((c) => ({
        front:      c.front,
        back:       c.back,
        frontImage: c.frontImage ?? null,
        backImage:  c.backImage  ?? null,
        deckId:     deck.id,
      }))
    )
  }

  const full = await Deck.findByPk(deck.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
  })

  res.status(201).json(formatDeck({
    ...full.toJSON(),
    cards: createdCards.map((c) => ({ ...c.toJSON(), _id: c.id })),
  }))
}

// PUT /api/decks/:id
export const updateDeck = async (req, res) => {
  const deck = await Deck.findByPk(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (Number(deck.ownerId) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { title, description, isPublic } = req.body
  await deck.update({ title, description, isPublic })

  const full = await Deck.findByPk(deck.id, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] },
      { model: Card, as: 'cards', order: [['createdAt', 'ASC']] },
    ],
  })

  res.json(formatDeck(full))
}

// DELETE /api/decks/:id
export const deleteDeck = async (req, res) => {
  const deck = await Deck.findByPk(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (Number(deck.ownerId) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  await deck.destroy()
  res.json({ message: 'Deck deleted successfully' })
}

// POST /api/decks/:id/cards
export const addCards = async (req, res) => {
  const deck = await Deck.findByPk(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (Number(deck.ownerId) !== Number(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { cards = [] } = req.body
  if (cards.length === 0) {
    return res.status(400).json({ message: 'No cards provided' })
  }

  const created = await Card.bulkCreate(
    cards.map((c) => ({
      front:      c.front,
      back:       c.back,
      frontImage: c.frontImage ?? null,
      backImage:  c.backImage  ?? null,
      deckId:     deck.id,
    }))
  )

  res.status(201).json(created.map((c) => ({ ...c.toJSON(), _id: c.id })))
}