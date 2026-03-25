import { User }         from './User.js'
import { Class }        from './Class.js'
import { Deck }         from './Deck.js'
import { Card }         from './Card.js'
import { StudySession } from './StudySession.js'
import { CardRating }   from './CardRating.js'

// ── Associations ──

// User → Classes
User.hasMany(Class, { foreignKey: 'owner_id', as: 'classes', onDelete: 'CASCADE' })
Class.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' })

// User → Decks
User.hasMany(Deck, { foreignKey: 'owner_id', as: 'decks', onDelete: 'CASCADE' })
Deck.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' })

// Class → Decks
Class.hasMany(Deck, { foreignKey: 'class_id', as: 'decks', onDelete: 'CASCADE' })
Deck.belongsTo(Class, { foreignKey: 'class_id', as: 'class' })

// Deck → Cards
Deck.hasMany(Card, { foreignKey: 'deck_id', as: 'cards', onDelete: 'CASCADE' })
Card.belongsTo(Deck, { foreignKey: 'deck_id', as: 'deck' })

// User → StudySessions
User.hasMany(StudySession, { foreignKey: 'user_id', as: 'sessions', onDelete: 'CASCADE' })
StudySession.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

// Deck → StudySessions
Deck.hasMany(StudySession, { foreignKey: 'deck_id', as: 'sessions', onDelete: 'CASCADE' })
StudySession.belongsTo(Deck, { foreignKey: 'deck_id', as: 'deck' })

// User + Card → CardRatings
User.hasMany(CardRating, { foreignKey: 'user_id', onDelete: 'CASCADE' })
CardRating.belongsTo(User, { foreignKey: 'user_id' })

Card.hasMany(CardRating, { foreignKey: 'card_id', onDelete: 'CASCADE' })
CardRating.belongsTo(Card, { foreignKey: 'card_id' })

Deck.hasMany(CardRating, { foreignKey: 'deck_id', onDelete: 'CASCADE' })
CardRating.belongsTo(Deck, { foreignKey: 'deck_id' })


// Add _id alias to all models for frontend compatibility
const addIdAlias = (Model) => {
  Model.addHook('afterFind', (results) => {
    if (!results) return
    const list = Array.isArray(results) ? results : [results]
    list.forEach((instance) => {
      if (instance?.dataValues) {
        instance.dataValues._id = instance.dataValues.id
      }
    })
  })
}

addIdAlias(User)
addIdAlias(Class)
addIdAlias(Deck)
addIdAlias(Card)
addIdAlias(StudySession)
addIdAlias(CardRating)


export { User, Class, Deck, Card, StudySession, CardRating }