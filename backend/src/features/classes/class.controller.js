import { Op }                      from 'sequelize'
import { Class, Deck, Card, User } from '../../models/index.js'

const formatClass = (cls) => {
  const json = cls.toJSON ? cls.toJSON() : cls
  return {
    ...json,
    _id:  json.id,
    icon: { type: json.iconType, value: json.iconValue },
    owner: json.owner
      ? { ...json.owner, _id: json.owner.id }
      : { _id: json.ownerId, id: json.ownerId },
  }
}

// GET /api/classes
export const getClasses = async (req, res) => {
  const { q, onlyMine } = req.query
  const userId  = Number(req.user.id)
  const isAdmin = req.user.role === 'admin'

  let where = {}

  if (isAdmin && onlyMine !== 'true') {
    where = {}
  } else if (onlyMine === 'true') {
    where = { ownerId: userId }
  } else {
    where = { [Op.or]: [{ isPublic: true }, { ownerId: userId }] }
  }

  if (q) where.name = { [Op.like]: `%${q}%` }

  const classes = await Class.findAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
    order: [['createdAt', 'DESC']],
  })

  const withCounts = await Promise.all(
    classes.map(async (cls) => {
      const deckCount = await Deck.count({ where: { classId: cls.id } })
      return { ...formatClass(cls), deckCount }
    })
  )

  res.json(withCounts)
}

// GET /api/classes/:id
export const getClass = async (req, res) => {
  const cls = await Class.findByPk(req.params.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
  })
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  const deckCount = await Deck.count({ where: { classId: cls.id } })
  res.json({ ...formatClass(cls), deckCount })
}

// POST /api/classes
export const createClass = async (req, res) => {
  const { name, description, icon, color, isPublic } = req.body
  if (!name) return res.status(400).json({ message: 'Name is required' })

  const cls = await Class.create({
    name,
    description,
    iconType:  icon?.type  ?? 'emoji',
    iconValue: icon?.value ?? '📚',
    color,
    isPublic,
    ownerId: Number(req.user.id),
  })

  const full = await Class.findByPk(cls.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
  })

  res.status(201).json({ ...formatClass(full), deckCount: 0 })
}

// PUT /api/classes/:id
export const updateClass = async (req, res) => {
  const cls = await Class.findByPk(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (Number(cls.ownerId) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { name, description, icon, color, isPublic } = req.body

  await cls.update({
    name:        name        ?? cls.name,
    description: description !== undefined ? description : cls.description,
    iconType:    icon?.type  ?? cls.iconType,
    iconValue:   icon?.value ?? cls.iconValue,
    color:       color       ?? cls.color,
    isPublic:    isPublic    !== undefined ? isPublic : cls.isPublic,
  })

  const fresh = await Class.findByPk(cls.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
  })
  const deckCount = await Deck.count({ where: { classId: cls.id } })
  res.json({ ...formatClass(fresh), deckCount })
}

// DELETE /api/classes/:id
export const deleteClass = async (req, res) => {
  const cls = await Class.findByPk(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  if (Number(cls.ownerId) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  await cls.destroy()
  res.json({ message: 'Class deleted successfully' })
}

// GET /api/classes/:id/decks
export const getDecksByClass = async (req, res) => {
  const cls = await Class.findByPk(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  const isAdmin = req.user.role === 'admin'

  const where = isAdmin
    ? { classId: req.params.id }
    : {
        classId: req.params.id,
        [Op.or]: [{ isPublic: true }, { ownerId: Number(req.user.id) }],
      }

  const decks = await Deck.findAll({
    where,
    include: [
      { model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] },
      { model: Card, as: 'cards', order: [['createdAt', 'ASC']] },
    ],
    order: [['createdAt', 'DESC']],
  })

  res.json(decks.map((d) => {
    const json = d.toJSON()
    return {
      ...json,
      _id:   json.id,
      owner: json.owner ? { ...json.owner, _id: json.owner.id } : null,
      cards: (json.cards ?? []).map((c) => ({ ...c, _id: c.id })),
    }
  }))
}

// POST /api/classes/:id/copy
export const copyClass = async (req, res) => {
  const original = await Class.findByPk(req.params.id)
  if (!original) return res.status(404).json({ message: 'Class not found' })

  const copy = await Class.create({
    name:        `${original.name} (Copy)`,
    description: original.description,
    iconType:    original.iconType,
    iconValue:   original.iconValue,
    color:       original.color,
    isPublic:    false,
    ownerId:     Number(req.user.id),
  })

  const decks = await Deck.findAll({
    where:   { classId: original.id },
    include: [{ model: Card, as: 'cards' }],
  })

  await Promise.all(decks.map(async (deck) => {
    const newDeck = await Deck.create({
      title:       deck.title,
      description: deck.description,
      isPublic:    false,
      classId:     copy.id,
      ownerId:     Number(req.user.id),
    })
    if (deck.cards?.length > 0) {
      await Card.bulkCreate(deck.cards.map((c) => ({
        front:      c.front,
        back:       c.back,
        frontImage: c.frontImage,
        backImage:  c.backImage,
        deckId:     newDeck.id,
      })))
    }
  }))

  const full = await Class.findByPk(copy.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
  })
  const deckCount = await Deck.count({ where: { classId: copy.id } })
  res.status(201).json({ ...formatClass(full), deckCount })
}