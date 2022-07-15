const { Client } = require("statcord.js")
const client = require('./index')

const statcord = new Client({ client: client, key: process.env.STATCORD_KEY })

statcord.on("autopost-start", () => console.log("Statcord Data Connection | OK!"))

module.exports = statcord