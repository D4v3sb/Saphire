const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'safado',
    aliases: ['safada'],
    category: 'random',
    emoji: '😏',
    usage: '/medidor',
    description: 'Quantos % @user é safado(a)?',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/medidor\``)
    }
}