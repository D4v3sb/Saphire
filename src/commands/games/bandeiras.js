const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'bandeiras',
    aliases: ['flag', 'flags', 'bandeira', 'band', 'bands'],
    category: 'games',
    emoji: '🎌',
    usage: '/bandeiras',
    description: 'Adivinhe a bandeira',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/bandeiras\``)
    }
}