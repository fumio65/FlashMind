import { CardRating } from '../../models/index.js'

// POST /api/ratings
export const saveRatings = async (req, res) => {
  const { deckId, ratings } = req.body

  if (!deckId || !ratings?.length) {
    return res.status(400).json({ message: 'deckId and ratings are required' })
  }

  await Promise.all(
    ratings.map((r) =>
      CardRating.upsert({
        userId: req.user.id,
        cardId: r.cardId,
        deckId,
        rating: r.rating,
      })
    )
  )

  res.json({ message: 'Ratings saved' })
}

// GET /api/ratings/:deckId
export const getDeckRatings = async (req, res) => {
  const ratings = await CardRating.findAll({
    where: { userId: req.user.id, deckId: req.params.deckId },
    attributes: ['cardId', 'rating'],
  })

  const ratingMap = {}
  ratings.forEach((r) => {
    ratingMap[r.cardId] = r.rating
  })

  res.json(ratingMap)
}