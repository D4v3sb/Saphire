const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'logomarca',
    category: 'games',
    emoji: `${e.logomarca}`,
    usage: '/logomarca',
    description: 'Você é bom em reconhecer marcas?',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/logomarca\``)
    }
}