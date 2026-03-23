import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  front:      { type: String, required: true, trim: true },
  back:       { type: String, required: true, trim: true },
  frontImage: { type: String, default: null },
  backImage:  { type: String, default: null },
  deck:       { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true, index: true },
}, { timestamps: true })

export const Card = mongoose.model('Card', cardSchema)