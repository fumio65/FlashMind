// Picks correct card + 3 random distractors, shuffles options
export function generateQuizQuestions(cards) {
  if (cards.length < 2) return []

  return cards.map((card) => {
    const distractors = cards
      .filter((c) => c._id !== card._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => ({ text: c.back, isCorrect: false }))

    const options = [
      { text: card.back, isCorrect: true },
      ...distractors,
    ].sort(() => Math.random() - 0.5)

    return {
      id:       card._id,
      question: card.front,
      options,
    }
  })
}