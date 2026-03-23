import { Card } from '../../models/Card.js'
import { Deck } from '../../models/Deck.js'

// PUT /api/cards/:id
export const updateCard = async (req, res) => {
  const card = await Card.findById(req.params.id)
  if (!card) return res.status(404).json({ message: 'Card not found' })

  // Verify ownership via deck
  const deck = await Deck.findById(card.deck)
  if (deck.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { front, back, frontImage, backImage } = req.body
  Object.assign(card, { front, back, frontImage, backImage })
  await card.save()

  res.json(card)
}

// DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  const card = await Card.findById(req.params.id)
  if (!card) return res.status(404).json({ message: 'Card not found' })

  const deck = await Deck.findById(card.deck)
  if (deck.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  await card.deleteOne()
  res.json({ message: 'Card deleted successfully' })
}