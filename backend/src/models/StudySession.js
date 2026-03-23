import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  deck:       { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  mode:       { type: String, enum: ['flashcard', 'quiz'], required: true },
  score:      { type: Number, default: 0 },
  knownCount: { type: Number, default: 0 },
  timeTaken:  { type: Number, default: 0 },
  completedAt:{ type: Date, default: Date.now, index: true },
}, { timestamps: true })

export const StudySession = mongoose.model('StudySession', studySessionSchema)