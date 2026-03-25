import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";
import bcrypt from "bcrypt";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT("long"),
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM("student", "admin"),
      defaultValue: "student",
    },
    status: {
      type: DataTypes.ENUM("active", "suspended", "banned"),
      defaultValue: "active",
    },
    studyStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastStudiedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

User.prototype.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

User.addHook('afterFind', (users) => {
  if (!users) return
  const list = Array.isArray(users) ? users : [users]
  list.forEach((u) => { if (u) u.dataValues._id = u.dataValues.id })
})