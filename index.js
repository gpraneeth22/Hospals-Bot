const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const { getWeatherUpdates } = require("./weather");
const User = require("./mongodb");

token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const note = "Note: Wrong Location? Please share your current location...";

bot.onText(/\/start/, async (msg) => {
  var name = "";
  const chatId = msg.chat.id;
  const currentUser = await User.findOne({ chat_id: chatId });
  const firstName = msg.chat.first_name;
  const lastName = msg.chat.last_name;
  const userName = msg.chat.username;
  if (firstName) {
    if (lastName) {
      name = firstName + lastName;
    } else {
      name = firstName;
    }
  } else {
    name = userName;
  }
  if (currentUser) {
    bot.sendMessage(
      chatId,
      `Hey ${name}!\n You've already subscribed! Weather updates are on your way.`
    );
    bot.sendChatAction(chatId, "typing");
    if (currentUser.location.length) {
      bot.sendChatAction(chatId, "typing");
      const update = await getWeatherUpdates(
        currentUser.location[0],
        currentUser.location[1]
      );
      bot.sendMessage(chatId, update["msg"]);
    } else {
      bot.sendMessage(
        chatId,
        "I don't have your location information. Feel free to share your location details for weather updates\n NOTE: We store you location details very securely!",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Share Location",
                  request_location: true,
                },
              ],
            ],
            one_time_keyboard: true,
          },
        }
      );
    }
  } else {
    bot.sendMessage(
      chatId,
      `Hello ${name}! Subscribe to get weather updates of your city automatically!\nTo Subscribe, click here --> /subscribe`
    );
  }
});

bot.onText(/\/subscribe/, async (msg) => {
  var name = "";
  const chatId = msg.chat.id;
  bot.sendChatAction(chatId, "typing");
  const currentUser = await User.findOne({ chat_id: chatId });
  const firstName = msg.chat.first_name;
  const lastName = msg.chat.last_name;
  const userName = msg.chat.username;

  if (currentUser) {
    if (firstName) {
      if (lastName) {
        name = firstName + lastName;
      } else {
        name = firstName;
      }
    } else {
      name = userName;
    }
    bot.sendMessage(
      chatId,
      `Hey ${name}! You're already our subscriber! Weather updates are on your way.`
    );
    if (currentUser.location.length) {
      bot.sendChatAction(chatId, "typing");
      const update = await getWeatherUpdates(
        currentUser.location[0],
        currentUser.location[1]
      );
      bot.sendMessage(chatId, update["msg"]);
    } else {
      bot.sendMessage(
        chatId,
        "I don't have your location information. Feel free to share your location details for weather updates\n NOTE: We store you location details very securely!",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Share Location",
                  request_location: true,
                },
              ],
            ],
            one_time_keyboard: true,
          },
        }
      );
    }
  } else {
    const createdUser = await User.create({
      chat_id: chatId,
      firstname: firstName,
      lastname: lastName,
      username: userName,
    });
    bot.sendChatAction(chatId, "typing");
    bot.sendMessage(
      chatId,
      "Thank you for subscribing to Hospals Weather Bot!\nFrom now, You'll get weather updates periodically!"
    );
    bot.sendMessage(
      chatId,
      "For better and accurate weather updates, Please share your location",
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Share Location",
                request_location: true,
              },
            ],
          ],
          one_time_keyboard: true,
        },
      }
    );
  }
});

bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const currentUser = await User.findOne({ chat_id: chatId });
  if (currentUser) {
    const location = msg.location; // The user's location data
    const userLocation = [location.latitude, location.longitude];
    bot.sendMessage(chatId, "Thankyou for sharing location.");
    bot.sendChatAction(chatId, "typing");
    const update = await getWeatherUpdates(
      location.latitude,
      location.longitude
    );
    await User.findOneAndUpdate(
      { chat_id: chatId },
      { location: userLocation, city: update['city'], country: update['country'] }
    );
    bot.sendMessage(chatId, update['msg']);
  } else {
    bot.sendMessage(
      chatId,
      "You're not subscribed to Hospals Weather Bot.\n To subscribe, \n click on --> /subscribe"
    );
  }
});
