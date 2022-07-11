const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'vote',
    aliases: ['pull', 'votação', 'voto'],
    category: 'util',
    ClientPermissions: ['ADD_REACTIONS'],
    emoji: `${e.Upvote}`,
    usage: '/vote',
    description: 'Resgate sua recompensa de voto',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/vote\``)
    }
}