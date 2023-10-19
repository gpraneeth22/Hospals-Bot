const mongoose = require("mongoose");

require('dotenv').config()

const mongoURL = process.env.mongoURL;

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected!")
  }).catch((error) => {
    console.log(error)
  });

const UserSubscriptionSchema = new mongoose.Schema({
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    chat_id: {
      type: Number,
      required: [true, "chat_id is required"],
      unique: true
    },
    location: {
        type: Array
    },
    city: {
      type: String
    },
    country: {
      type: String
    }
    
  },)

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema)
