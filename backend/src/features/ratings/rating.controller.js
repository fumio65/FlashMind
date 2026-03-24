import { CardRating } from '../../models/CardRating.js'

// POST /api/ratings — save multiple ratings at once
export const saveRatings = async (req, res) => {
  const { deckId, ratings } = req.body
  // ratings = [{ cardId, rating }]

  if (!deckId || !ratings?.length) {
    return res.status(400).json({ message: 'deckId and ratings are required' })
  }

  // Upsert each rating
  await Promise.all(
    ratings.map((r) =>
      CardRating.findOneAndUpdate(
        { user: req.user._id, card: r.cardId },
        { user: req.user._id, card: r.cardId, deck: deckId, rating: r.rating },
        { upsert: true, new: true }
      )
    )
  )

  res.json({ message: 'Ratings saved' })
}

// GET /api/ratings/:deckId — get user's ratings for a deck
export const getDeckRatings = async (req, res) => {
  const ratings = await CardRating.find({
    user: req.user._id,
    deck: req.params.deckId,
  }).select('card rating')

  // Return as { cardId: rating } map for easy lookup
  const ratingMap = {}
  ratings.forEach((r) => {
    ratingMap[r.card.toString()] = r.rating
  })

  res.json(ratingMap)
}