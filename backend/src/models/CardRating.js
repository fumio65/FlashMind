import mongoose from 'mongoose'

const cardRatingSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  card:   { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true, index: true },
  deck:   { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true })

// One rating per user per card — upsert on save
cardRatingSchema.index({ user: 1, card: 1 }, { unique: true })

export const CardRating = mongoose.model('CardRating', cardRatingSchema)