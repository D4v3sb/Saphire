const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'corno',
    category: 'random',
    emoji: '🦌',
    usage: '<corno> [@user]',
    description: 'Quanto % @user é corno(a)?',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {

        let num = Math.floor(Math.random() * 100) + 1,
            user = message.mentions.members.first() || message.member,
            Emoji = num > 70 ? e.Corno : '🦌'

        if (user.id === client.user.id) return message.reply('Eu nunca namorei, então não tem como eu ser corna.')

        return message.reply(`${Emoji} | Pelo jeito de ${user}, posso dizer que é ${num}% corno.`)
    }
}