import mongoose from 'mongoose'

const deckSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  isPublic:    { type: Boolean, default: false, index: true },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true })

export const Deck = mongoose.model('Deck', deckSchema)