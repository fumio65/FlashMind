import { Card, Deck } from '../../models/index.js'

// PUT /api/cards/:id
export const updateCard = async (req, res) => {
  const card = await Card.findByPk(req.params.id)
  if (!card) return res.status(404).json({ message: 'Card not found' })

  const deck = await Deck.findByPk(card.deckId)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (Number(deck.ownerId) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { front, back, frontImage, backImage } = req.body
  await card.update({ front, back, frontImage, backImage })

  res.json({ ...card.toJSON(), _id: card.id })
}

// DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  const card = await Card.findByPk(req.params.id)
  if (!card) return res.status(404).json({ message: 'Card not found' })

  const deck = await Deck.findByPk(card.deckId)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (Number(deck.ownerId) !== Number(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  await card.destroy()
  res.json({ message: 'Card deleted successfully' })
}