const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const {getWeatherUpdates} = require('./weather')

require('dotenv').config()

token = process.env.BOT_TOKEN

const bot = new TelegramBot(token, { polling: true });

var userLon = ''
var userLat = ''

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.chat.first_name + msg.chat.last_name
    bot.sendMessage(chatId, "Hello " + name + "! Subscribe to get weather updates of your city automatically! Please share your location to get accurate weather updates!", {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'Share Location',
                        'request_location': true
                    }
                ]
            ],
            one_time_keyboard: true
        }
    })
  });

bot.on('location', (msg) => {
    const chatId = msg.chat.id;
    const location = msg.location; // The user's location data
    userLat = location.latitude;
    userLon = location.longitude;
    bot.sendMessage(chatId, "Thankyou for sharing location.\nUse /subscribe to start getting Weather Updates.")
})

bot.onText(/\/subscribe/, async (msg) => {
    const chatId = msg.chat.id;
    const weatherUpdate = await getWeatherUpdates(userLat, userLon)

    const message = "Current Weather: " + weatherUpdate['currentWeather'] + "\n" +
                    "🌡️ Temperature: " + weatherUpdate['temperature'] +
                    "🌡️ Feels Like: " + weatherUpdate['feelsLike'] +
                    "🌊 Humidity: " + weatherUpdate['humidity'] +
                    "💨 Wind: " + weatherUpdate['wind'] + 
                    "☁️ Clouds: " + weatherUpdate['clouds'] +
                    "🌞 Sunrise: " + weatherUpdate['sunrise'] + 
                    "🌅 Sunset: " + weatherUpdate['sunset'] +
                    weatherUpdate['description'] + " in " + weatherUpdate['city'] + ", " + weatherUpdate['country'] + "\n" +
                    "Enjoy your day! ☔️"

    bot.sendMessage(chatId, message)
});
