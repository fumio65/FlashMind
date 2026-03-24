import { Card } from '../../models/Card.js'
import { Deck } from '../../models/Deck.js'

// PUT /api/cards/:id
export const updateCard = async (req, res) => {
  const card = await Card.findById(req.params.id)
  if (!card) return res.status(404).json({ message: 'Card not found' })

  const deck = await Deck.findById(card.deck)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (deck.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  const { front, back, frontImage, backImage } = req.body

  const updated = await Card.findByIdAndUpdate(
    req.params.id,
    { $set: { front, back, frontImage, backImage } },
    { returnDocument: 'after', runValidators: true }
  )

  res.json(updated)
}

// DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  const card = await Card.findById(req.params.id)
  if (!card) return res.status(404).json({ message: 'Card not found' })

  const deck = await Deck.findById(card.deck)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  if (deck.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }

  await card.deleteOne()
  res.json({ message: 'Card deleted successfully' })
}