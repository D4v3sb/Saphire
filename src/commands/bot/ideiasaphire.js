const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'ideiasaphire',
    aliases: ['sendideia', 'sugerir', 'sendsugest', 'sugest'],
    category: 'bot',
    emoji: '📨',
    usage: '/sugest',
    description: 'Sugira algo para que meu criador insira no meu sistema',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/sugest\``)
    }
}