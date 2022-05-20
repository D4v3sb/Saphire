const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'gado',
    aliases: ['boi'],
    category: 'random',


    emoji: '🐂',
    usage: '<gado> [@user]',
    description: 'Quanto % @user é gado(a)?',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {

        let num = Math.floor(Math.random() * 100) + 1,
            user = message.mentions.members.first() || message.member,
            Emoji = num > 70 ? e.GadoDemais : '🐂'

        if (user.id === client.user.id) { return message.reply(`${e.SaphireTimida} | Eu não sou gada, sai pra lá.`) }

        return message.reply(`${Emoji} | Pelo histórico de ${user}, posso afirmar que é ${num}% gado.`)
    }
}