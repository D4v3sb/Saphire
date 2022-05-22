const { e } = require('../../../JSON/emojis.json')
const Error = require('../../../modules/functions/config/errors')

module.exports = {
    name: 'ping',
    aliases: ['ws', 'ms', 'latency'],
    category: 'bot',
    cooldown: 5000,
    emoji: '🏓',
    description: 'Ping/Latency do bot',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        await message.reply(`${e.Loading} Pinging...`).then(msg => {
            msg.edit(`⏱️ Latency Client: ${Math.floor(msg.createdAt - message.createdAt)}ms | Latency Server: ${client.ws.ping}ms`).catch(() => { })
        }).catch(err => {
            Error(message, err)
            return message.channel.send(`${e.Deny} | Ocorreu um erro no comando ping:\n\`${err}\``)
        })
    }
}