const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true
    },
    articles: {
      type:[Schema.Types.ObjectId],
      ref: 'Article'
    },
    favorites:{
      type:[Schema.Types.ObjectId],
      ref: 'Article'
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
